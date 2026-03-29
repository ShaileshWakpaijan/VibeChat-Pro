"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

import { toastStyles } from "@/lib/ToastStyle";
import useMoodVisibility from "@/hooks/useMoodVisibility";
import useGetFriendList from "@/hooks/useGetFriendList";

const moodVisibilitySchema = z.object({
  mode: z.enum(["everyone", "nobody", "custom"]),
});

type MoodMode = z.infer<typeof moodVisibilitySchema>["mode"];

type MoodVisibilityFormValues = z.infer<typeof moodVisibilitySchema>;

type FriendItem = {
  _id: string;
  username: string;
  email?: string;
  avatar?: string;
};

const normalizeIds = (ids: string[]) => [...new Set(ids.filter(Boolean))];

const MoodVisibility = () => {
  const router = useRouter();
  const session = useSession();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getFriendListFn = useGetFriendList();

  const { getMoodVisibility, updateMoodVisibility } = useMoodVisibility();

  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [search, setSearch] = useState("");

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const moodVisibilityForm = useForm<MoodVisibilityFormValues>({
    resolver: zodResolver(moodVisibilitySchema),
    defaultValues: {
      mode: "everyone",
    },
  });

  const mode = moodVisibilityForm.watch("mode");

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return friends;

    return friends.filter((friend) => {
      const name = friend.username?.toLowerCase() ?? "";
      const email = friend.email?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query);
    });
  }, [friends, search]);

  const toggleFriend = (friendId: string, checked: boolean) => {
    setSelectedFriends((prev) => {
      if (checked) {
        return prev.includes(friendId) ? prev : [...prev, friendId];
      }
      return prev.filter((id) => id !== friendId);
    });
  };

  const loadMoodVisibility = async () => {
    try {
      setPageLoading(true);
      const res = await getMoodVisibility();

      if (!res?.success) {
        toast.error(
          <span>{res?.message || "Failed to load mood visibility."}</span>,
          {
            style: toastStyles.danger as React.CSSProperties,
          },
        );
        return;
      }

      const data = res.data as {
        mode: MoodMode;
        customFriends?: Array<string | { _id?: string }>;
      };

      const currentMode = data?.mode ?? "everyone";
      const currentCustomFriends = Array.isArray(data?.customFriends)
        ? data.customFriends
            .map((item) => {
              if (typeof item === "string") return item;
              return item?._id ? String(item._id) : "";
            })
            .filter(Boolean)
        : [];

      moodVisibilityForm.reset({
        mode: currentMode,
      });

      setSelectedFriends(normalizeIds(currentCustomFriends));
    } catch (error) {
      console.error("Load mood visibility failed", error);
      toast.error(<span>Failed to load mood visibility.</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session.status === "authenticated") {
      loadMoodVisibility();
    }
  }, [session.status]);

  useEffect(() => {
    const loadFriends = async () => {
      const res = await getFriendListFn();
      if (res.success) setFriends(res.data);
    };
    loadFriends();
  }, []);

  const handleMoodVisibilityChange = async (
    values: MoodVisibilityFormValues,
  ) => {
    try {
      setSaving(true);

      const payload: any = {
        mode: values.mode,
      };

      if (values.mode === "custom") {
        const cleanedSelected = normalizeIds(selectedFriends);

        if (cleanedSelected.length === 0) {
          toast.error(
            <span>Select at least one friend for Custom mode.</span>,
            {
              style: toastStyles.danger as React.CSSProperties,
            },
          );
          return;
        }
        payload.customFriends = cleanedSelected;
      }
      
      const res = await updateMoodVisibility(payload);

      if (!res?.success) {
        toast.error(
          <span>{res?.message || "Failed to update mood visibility."}</span>,
          {
            style: toastStyles.danger as React.CSSProperties,
          },
        );
        return;
      }

      toast.success(<span>Mood visibility updated.</span>, {
        style: toastStyles.success as React.CSSProperties,
      });
      await loadMoodVisibility();
    } catch (error) {
      console.error("Update mood visibility failed", error);
      toast.error(<span>Failed to update mood visibility.</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
    } finally {
      setSaving(false);
    }
  };

  if (session.status === "loading" || pageLoading) {
    return (
      <Card className="w-full max-w-2xl mx-2 shadow-md border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading mood visibility...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-2 shadow-md border gap-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Who can see you mood?
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <Form {...moodVisibilityForm}>
          <form
            onSubmit={moodVisibilityForm.handleSubmit(
              handleMoodVisibilityChange,
            )}
            className="flex flex-col gap-5"
            noValidate
          >
            <FormField
              name="mode"
              control={moodVisibilityForm.control}
              render={({ field }) => (
                <FormItem>
                  <RadioGroup
                    className="grid gap-3"
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <Label
                      htmlFor="everyone"
                      className="flex items-center gap-3 rounded-md border p-3 cursor-pointer"
                    >
                      <RadioGroupItem value="everyone" id="everyone" />
                      <span>Everyone</span>
                    </Label>

                    <Label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer">
                      <RadioGroupItem value="nobody" id="nobody" />
                      <span>Nobody</span>
                    </Label>

                    <Label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer">
                      <RadioGroupItem value="custom" id="custom" />
                      <span>Custom</span>
                    </Label>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "custom" && (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium">Select friends</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose who can see your mood.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedFriends.length} selected
                  </p>
                </div>

                <Input
                  placeholder="Search friends..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Separator />

                <ScrollArea className="h-36 pr-3">
                  <div className="space-y-3">
                    {filteredFriends.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No friends found.
                      </p>
                    ) : (
                      filteredFriends.map((friend) => {
                        const checked = selectedFriends.includes(friend._id);

                        return (
                          <label
                            key={friend._id}
                            htmlFor={friend._id}
                            className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40"
                          >
                            <Checkbox
                              id={friend._id}
                              checked={checked}
                              onCheckedChange={(val) =>
                                toggleFriend(friend._id, Boolean(val))
                              }
                            />

                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-sm font-medium">
                                {friend.username}
                              </span>
                              {friend.email && (
                                <span className="truncate text-xs text-muted-foreground">
                                  {friend.email}
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            <Button disabled={saving} type="submit" className="w-full">
              {saving ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MoodVisibility;
