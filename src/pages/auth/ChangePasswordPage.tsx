"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { profileAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const result = await profileAPI.changePassword(formData);
            setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
            toast({
                description: "Password changed successfully!",
                duration: 3000,
            });
            navigate("/profile");
        } catch (err: any) {
            setMessage(err.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Change Password</h1>
                    {/* Return button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)} // go back to previous page
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Update your password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Old Password"
                            disabled={loading}
                        />
                        <Input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="New Password"
                            disabled={loading}
                        />
                        <Input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            placeholder="Confirm New Password"
                            disabled={loading}
                        />

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>

                        {message && (
                            <p className="text-sm text-center mt-2 text-muted-foreground">
                                {message}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
