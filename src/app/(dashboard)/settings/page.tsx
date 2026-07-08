"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Settings,
  Target,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import showToast from "@/components/ToastComponent";
import {
  getProjectStatusTemplates,
  updateProjectStatusTemplates,
} from "@/app/actions/settings";

type ProjectStatusTemplateFormItem = {
  title: string;
  color: string;
  isTerminal: boolean;
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [templates, setTemplates] = useState<ProjectStatusTemplateFormItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const templatesQuery = useQuery({
    queryKey: ["super-admin-project-status-templates"],
    queryFn: getProjectStatusTemplates,
  });

  useEffect(() => {
    if (!templatesQuery.data?.success) {
      return;
    }

    setTemplates(
      (templatesQuery.data.data ?? []).map((item: any) => ({
        title: item.title || "",
        color: item.color || "#94A3B8",
        isTerminal: Boolean(item.isTerminal),
      })),
    );
  }, [templatesQuery.data]);

  const handleTemplateChange = (
    index: number,
    field: keyof ProjectStatusTemplateFormItem,
    value: string | boolean,
  ) => {
    setTemplates((current) =>
      current.map((template, templateIndex) =>
        templateIndex === index
          ? { ...template, [field]: value }
          : field === "isTerminal"
            ? { ...template, isTerminal: false }
            : template,
      ),
    );
  };

  const handleAddTemplate = () => {
    setTemplates((current) => [
      ...current,
      {
        title: "",
        color: "#64748B",
        isTerminal: current.length === 0,
      },
    ]);
  };

  const handleRemoveTemplate = (index: number) => {
    setTemplates((current) => {
      const next = current.filter((_, templateIndex) => templateIndex !== index);
      if (next.length === 0) {
        return next;
      }

      if (!next.some((template) => template.isTerminal)) {
        const doneIndex = next.findIndex(
          (template) => template.title.trim().toLowerCase() === "done",
        );
        const fallbackIndex = doneIndex >= 0 ? doneIndex : next.length - 1;

        return next.map((template, templateIndex) => ({
          ...template,
          isTerminal: templateIndex === fallbackIndex,
        }));
      }

      return next;
    });
  };

  const handleMoveTemplate = (index: number, direction: -1 | 1) => {
    setTemplates((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleSave = async () => {
    const cleaned = templates
      .map((template) => ({
        title: template.title.trim(),
        color: template.color.trim() || "#94A3B8",
        isTerminal: template.isTerminal,
        isDefault: true,
      }))
      .filter((template) => template.title.length > 0);

    if (cleaned.length === 0) {
      showToast("error", "Add at least one status template.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateProjectStatusTemplates(cleaned);
      if (!response.success) {
        showToast(
          "error",
          response.message || "Failed to update project status templates.",
        );
        return;
      }

      setTemplates(
        (response.data ?? []).map((item: any) => ({
          title: item.title || "",
          color: item.color || "#94A3B8",
          isTerminal: Boolean(item.isTerminal),
        })),
      );

      await queryClient.invalidateQueries({
        queryKey: ["super-admin-project-status-templates"],
      });
      showToast("success", "Project status defaults updated.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border bg-[linear-gradient(135deg,#0f172a_0%,#14532d_58%,#1d4ed8_120%)] text-white shadow-[0_24px_72px_rgba(15,23,42,0.18)]">
        <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                  Super Admin Settings
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Global Project Workflow
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">
              Control the default statuses every newly created project starts
              with across the platform. These are global presets managed from
              `tracker-admin`, not workspace admin.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-medium text-white/80">Current preset</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Status count
                </p>
                <p className="mt-2 text-2xl font-semibold">{templates.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Terminal status
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {templates.find((template) => template.isTerminal)?.title ||
                    "Will fallback to Done"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-0 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-emerald-600" />
            Project Status Defaults
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These statuses are cloned into every newly created project. You can
            add, update, delete, and reorder them here.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {templatesQuery.isLoading ? (
            <div className="flex min-h-24 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <div
                    key={`${index}-${template.title}`}
                    className="grid gap-3 rounded-2xl border bg-muted/20 p-4 lg:grid-cols-[minmax(0,1.4fr)_180px_140px_auto]"
                  >
                    <div className="grid gap-2">
                      <Label>Status title</Label>
                      <Input
                        value={template.title}
                        onChange={(event) =>
                          handleTemplateChange(index, "title", event.target.value)
                        }
                        placeholder="e.g. QA"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Status color</Label>
                      <Input
                        type="color"
                        value={template.color}
                        onChange={(event) =>
                          handleTemplateChange(index, "color", event.target.value)
                        }
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="rounded-2xl border bg-background p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">Terminal status</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Closed work lands here.
                          </p>
                        </div>
                        <Switch
                          checked={template.isTerminal}
                          onCheckedChange={(checked) =>
                            handleTemplateChange(index, "isTerminal", checked)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveTemplate(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveTemplate(index, 1)}
                        disabled={index === templates.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveTemplate(index)}
                        disabled={templates.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" onClick={handleAddTemplate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add status
                </Button>

                <Button type="button" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving presets
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save project statuses
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
