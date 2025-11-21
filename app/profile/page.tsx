'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Camera, Mail, User as UserIcon, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config";
import { getClientTimezone } from "@/lib/timezone";

interface UserProfile {
	username: string;
	email: string;
	avatar?: string;
	createdAt: string;
	recognitionCount: number;
}

interface BackendProfileResponse {
	success: boolean;
	data?: {
		id: string;
		username: string;
		email?: string;
		avatar?: string | null;
		createdAt?: string | null;
		recognitionCount?: number | null;
	};
	error?: string;
}

const formatDate = (value?: string | null) => {
	if (!value) {
		return "--";
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "--";
	}
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

export default function ProfilePage() {
	const router = useRouter();
	const { t } = useLanguage();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const timezone = useMemo(() => getClientTimezone(), []);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const fetchProfile = useCallback(async () => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token) {
			router.replace("/sign-in");
			return;
		}

		try {
			setErrorMessage(null);
			const url = `${API_ENDPOINTS.profile}?timezone=${encodeURIComponent(timezone)}`;
			const response = await fetchWithAuth(url, {
				headers: {
					"X-User-Timezone": timezone,
				},
			});
			const payload = (await response.json()) as BackendProfileResponse;

			if (response.status === 401) {
				router.replace("/sign-in");
				return;
			}

			if (!response.ok || !payload.success || !payload.data) {
				throw new Error(payload.error || "Failed to fetch profile");
			}

			const mappedProfile: UserProfile = {
				username: payload.data.username,
				email: payload.data.email || "",
				avatar: payload.data.avatar || "",
				createdAt: formatDate(payload.data.createdAt),
				recognitionCount: payload.data.recognitionCount ?? 0,
			};

			setProfile(mappedProfile);
			setFormData({
				username: mappedProfile.username,
				email: mappedProfile.email,
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			localStorage.setItem("username", mappedProfile.username);
		} catch (error) {
			console.error("Failed to load profile:", error);
			setErrorMessage(t("profile.loadError") || "无法加载用户信息");
		}
	}, [router, t, timezone]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	const handleSave = async () => {
		if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
			alert("两次输入的新密码不一致");
			return;
		}

		setIsSaving(true);
		try {
			const url = `${API_ENDPOINTS.profile}?timezone=${encodeURIComponent(timezone)}`;
			const response = await fetchWithAuth(url, {
				method: "PUT",
				headers: {
					"X-User-Timezone": timezone,
				},
				body: JSON.stringify({
					username: formData.username,
					email: formData.email,
					...(formData.newPassword && {
						currentPassword: formData.currentPassword,
						newPassword: formData.newPassword,
					}),
				}),
			});
			const payload = (await response.json()) as BackendProfileResponse;

			if (response.ok && payload.success) {
				localStorage.setItem("username", formData.username);
				setSaveSuccess(true);
				setIsEditing(false);
				fetchProfile();
				setTimeout(() => setSaveSuccess(false), 3000);
			} else {
				throw new Error(payload.error || "保存失败");
			}
		} catch (error) {
			console.error("Failed to save profile:", error);
			alert("保存失败，请检查输入信息");
		} finally {
			setIsSaving(false);
		}
	};

	const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const payload = new FormData();
		payload.append("avatar", file);

		try {
			await fetchWithAuth("/api/user/avatar", {
				method: "POST",
				body: payload,
			});
			fetchProfile();
		} catch (error) {
			console.error("头像上传失败", error);
		}
	};

	if (!profile) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<p className="text-muted-foreground">
						{errorMessage ? errorMessage : t("common.loading")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-4xl mx-auto">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="ghost" onClick={() => router.back()}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							{t("common.back")}
						</Button>
						<div>
							<h1 className="text-3xl font-bold">{t("profile.title")}</h1>
							<p className="text-muted-foreground mt-1">{t("profile.subtitle")}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<LanguageSwitcher />
						<ThemeSwitcher />
						{!isEditing && (
							<Button onClick={() => setIsEditing(true)}>
								{t("profile.edit")}
							</Button>
						)}
					</div>
				</div>

				{saveSuccess && (
					<Alert className="mb-6 border-green-200 bg-green-50">
						<AlertDescription className="text-green-800">
							✓ {t("profile.saveSuccess")}
						</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-6 md:grid-cols-3">
					<Card className="p-6 md:col-span-1">
						<div className="text-center">
							<div className="relative inline-block group">
								<Avatar className="w-32 h-32 mx-auto">
									<AvatarImage src={profile.avatar} />
									<AvatarFallback className="text-3xl">
										{profile.username.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
									<Camera className="h-8 w-8 text-white" />
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleAvatarUpload}
									/>
								</label>
							</div>

							<h2 className="mt-4 text-xl font-semibold">{profile.username}</h2>
							<p className="text-sm text-muted-foreground">{profile.email}</p>

							<Separator className="my-4" />

							<div className="space-y-3 text-left">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">{t("profile.registeredAt")}</span>
									<span className="font-medium">{profile.createdAt}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">{t("profile.recognitionCount")}</span>
									<span className="font-medium text-primary">
										{profile.recognitionCount} {t("profile.times")}
									</span>
								</div>
							</div>
						</div>
					</Card>

					<Card className="p-6 md:col-span-2">
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold mb-4">{t("profile.basicInfo")}</h3>
								<div className="space-y-4">
									<div>
										<Label htmlFor="username">
											<UserIcon className="inline h-4 w-4 mr-1" />
											{t("profile.username")}
										</Label>
										<Input
											id="username"
											value={formData.username}
											onChange={(e) => setFormData({ ...formData, username: e.target.value })}
											disabled={!isEditing}
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="email">
											<Mail className="inline h-4 w-4 mr-1" />
											{t("profile.email")}
										</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											disabled={!isEditing}
											className="mt-1"
										/>
									</div>
								</div>
							</div>

							<Separator />

							{isEditing && (
								<div>
									<h3 className="text-lg font-semibold mb-4">
										<Lock className="inline h-5 w-5 mr-1" />
										{t("profile.changePassword")}
									</h3>
									<div className="space-y-4">
										<div>
											<Label htmlFor="currentPassword">{t("profile.currentPassword")}</Label>
											<Input
												id="currentPassword"
												type="password"
												placeholder={t("profile.currentPasswordPlaceholder")}
												value={formData.currentPassword}
												onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
												className="mt-1"
											/>
										</div>

										<div>
											<Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
											<Input
												id="newPassword"
												type="password"
												placeholder={t("profile.newPasswordPlaceholder")}
												value={formData.newPassword}
												onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
												className="mt-1"
											/>
										</div>

										<div>
											<Label htmlFor="confirmPassword">{t("profile.confirmPassword")}</Label>
											<Input
												id="confirmPassword"
												type="password"
												placeholder={t("profile.confirmPasswordPlaceholder")}
												value={formData.confirmPassword}
												onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
												className="mt-1"
											/>
										</div>
									</div>
								</div>
							)}

							{isEditing && (
								<div className="flex gap-4">
									<Button
										variant="outline"
										className="flex-1"
										onClick={() => {
											setIsEditing(false);
											fetchProfile();
										}}
										disabled={isSaving}
									>
										{t("common.cancel")}
									</Button>
									<Button
										className="flex-1"
										onClick={handleSave}
										disabled={isSaving}
									>
										{isSaving ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
												{t("profile.saving")}
											</>
										) : (
											<>
												<Save className="h-4 w-4 mr-2" />
												{t("common.save")}
											</>
										)}
									</Button>
								</div>
							)}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
