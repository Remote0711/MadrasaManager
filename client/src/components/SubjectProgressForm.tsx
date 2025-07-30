import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Book, Heart, Brain, Save, TrendingUp } from "lucide-react";
import { tr } from "@/lib/tr";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const SURAHS = [
  "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah", "Al-Anam",
  "Al-Araf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd",
  "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shuara",
  "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah",
  "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar",
  "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat",
  "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqiah", "Al-Hadid",
  "Al-Mujadila", "Al-Hashr", "Al-Mumtahina", "As-Saff", "Al-Jumuah",
  "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk",
  "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Nuh", "Al-Jinn", "Al-Muzzammil",
  "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba",
  "An-Naziat", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin",
  "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-Ala", "Al-Ghashiyah",
  "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Lail", "Ad-Dhuha", "Ash-Sharh",
  "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qariah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraish",
  "Al-Maun", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas",
  "Al-Falaq", "An-Nas"
];

// Form schemas for each subject
const temelBilgilerSchema = z.object({
  pagesCompleted: z.coerce.number().min(0, "Sayfa sayısı 0'dan küçük olamaz"),
});

const quranSchema = z.object({
  quranPageNumber: z.coerce.number().min(1, "Sayfa numarası 1'den küçük olamaz").max(604, "Mushaf'ta 604 sayfa vardır"),
});

const ezberSchema = z.object({
  surahName: z.string().min(1, "Sure seçimi zorunludur"),
  ayahNumber: z.coerce.number().optional(),
});

const evaluationSchema = z.object({
  behaviorType: z.enum(['cok_dikkatli', 'dikkatli', 'orta', 'dikkatsiz', 'cok_dikkatsiz']),
  participation: z.coerce.number().min(1).max(10),
  attention: z.coerce.number().min(1).max(10),
  customNote: z.string().optional(),
});

interface SubjectProgressFormProps {
  studentId: string;
  studentName: string;
  week: number;
  plannedPages?: { from: number; to: number };
  onSuccess?: () => void;
}

export default function SubjectProgressForm({ 
  studentId, 
  studentName, 
  week, 
  plannedPages,
  onSuccess 
}: SubjectProgressFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const temelForm = useForm({
    resolver: zodResolver(temelBilgilerSchema),
    defaultValues: { pagesCompleted: 0 }
  });

  const quranForm = useForm({
    resolver: zodResolver(quranSchema),
    defaultValues: { quranPageNumber: 1 }
  });

  const ezberForm = useForm({
    resolver: zodResolver(ezberSchema),
    defaultValues: { surahName: "", ayahNumber: undefined }
  });

  const evaluationForm = useForm({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      behaviorType: "orta" as const,
      participation: 5,
      attention: 5,
      customNote: ""
    }
  });

  const subjectProgressMutation = useMutation({
    mutationFn: async (data: {
      subject: string;
      progressData: any;
    }) => {
      const response = await apiRequest("POST", "/api/teacher/subject-progress", {
        studentId,
        week,
        subject: data.subject,
        ...data.progressData
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ders ilerlemesi kaydedildi",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İlerleme kaydedilirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const evaluationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/teacher/evaluation", {
        studentId,
        week,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Öğrenci değerlendirmesi kaydedildi",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Değerlendirme kaydedilirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const calculateCompletionRate = (completed: number) => {
    if (!plannedPages) return 0;
    const totalPlanned = plannedPages.to - plannedPages.from + 1;
    return Math.min(100, Math.round((completed / totalPlanned) * 100));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {studentName} - Hafta {week} İlerlemesi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temel-bilgiler" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="temel-bilgiler" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              {tr.temelBilgiler}
            </TabsTrigger>
            <TabsTrigger value="kuran" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {tr.kuran}
            </TabsTrigger>
            <TabsTrigger value="ezber" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {tr.ezber}
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Değerlendirme
            </TabsTrigger>
          </TabsList>

          {/* Temel Bilgiler Tab */}
          <TabsContent value="temel-bilgiler" className="space-y-4">
            <Form {...temelForm}>
              <form onSubmit={temelForm.handleSubmit((data) => 
                subjectProgressMutation.mutate({
                  subject: "temel_bilgiler",
                  progressData: data
                })
              )} className="space-y-4">
                {plannedPages && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">{tr.weeklyPlan}</h4>
                    <p className="text-sm text-muted-foreground">
                      Planlanan: Sayfa {plannedPages.from}-{plannedPages.to} 
                      ({plannedPages.to - plannedPages.from + 1} sayfa)
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={calculateCompletionRate(temelForm.watch("pagesCompleted"))} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        %{calculateCompletionRate(temelForm.watch("pagesCompleted"))} tamamlandı
                      </p>
                    </div>
                  </div>
                )}

                <FormField
                  control={temelForm.control}
                  name="pagesCompleted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr.pagesCompleted}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder={tr.enterCompletedPages}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={subjectProgressMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {subjectProgressMutation.isPending ? "Kaydediliyor..." : tr.saveSubjectProgress}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Kur'an Tab */}
          <TabsContent value="kuran" className="space-y-4">
            <Form {...quranForm}>
              <form onSubmit={quranForm.handleSubmit((data) => 
                subjectProgressMutation.mutate({
                  subject: "kuran",
                  progressData: data
                })
              )} className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{tr.quranProgress}</h4>
                  <p className="text-sm text-muted-foreground">
                    Öğrencinin Mushaf'ta ulaştığı son sayfayı kaydedin
                  </p>
                </div>

                <FormField
                  control={quranForm.control}
                  name="quranPageNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr.mushafPage}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder={tr.enterQuranPage}
                          min="1"
                          max="604"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={subjectProgressMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {subjectProgressMutation.isPending ? "Kaydediliyor..." : tr.saveSubjectProgress}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Ezber Tab */}
          <TabsContent value="ezber" className="space-y-4">
            <Form {...ezberForm}>
              <form onSubmit={ezberForm.handleSubmit((data) => 
                subjectProgressMutation.mutate({
                  subject: "ezber",
                  progressData: data
                })
              )} className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{tr.ezberProgress}</h4>
                  <p className="text-sm text-muted-foreground">
                    Öğrencinin ezberlemekte olduğu sure ve ayet bilgilerini girin
                  </p>
                </div>

                <FormField
                  control={ezberForm.control}
                  name="surahName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr.surah}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={tr.selectSurah} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {SURAHS.map((surah, index) => (
                            <SelectItem key={surah} value={surah}>
                              {index + 1}. {surah}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ezberForm.control}
                  name="ayahNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr.ayahNumber}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder={tr.enterAyahNumber}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={subjectProgressMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {subjectProgressMutation.isPending ? "Kaydediliyor..." : tr.saveSubjectProgress}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-4">
            <Form {...evaluationForm}>
              <form onSubmit={evaluationForm.handleSubmit((data) => 
                evaluationMutation.mutate(data)
              )} className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{tr.studentEvaluation}</h4>
                  <p className="text-sm text-muted-foreground">
                    Öğrencinin haftalık davranış ve performans değerlendirmesi
                  </p>
                </div>

                <FormField
                  control={evaluationForm.control}
                  name="behaviorType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr.behaviorAssessment}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cok_dikkatli">{tr.behaviorTypes.cok_dikkatli}</SelectItem>
                          <SelectItem value="dikkatli">{tr.behaviorTypes.dikkatli}</SelectItem>
                          <SelectItem value="orta">{tr.behaviorTypes.orta}</SelectItem>
                          <SelectItem value="dikkatsiz">{tr.behaviorTypes.dikkatsiz}</SelectItem>
                          <SelectItem value="cok_dikkatsiz">{tr.behaviorTypes.cok_dikkatsiz}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={evaluationForm.control}
                    name="participation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr.participation} (1-10)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="10" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={evaluationForm.control}
                    name="attention"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr.attention} (1-10)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="10" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={evaluationForm.control}
                  name="customNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr.customNote}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Bu hafta öğrencinin durumu hakkında notlar..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={evaluationMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {evaluationMutation.isPending ? "Kaydediliyor..." : tr.saveEvaluation}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}