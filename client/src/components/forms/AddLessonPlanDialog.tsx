import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertLessonPlanSchema, type ProgramType } from "@shared/schema";

const lessonPlanFormSchema = insertLessonPlanSchema.extend({
  pagesFrom: z.coerce.number().min(1, "Başlangıç sayfası en az 1 olmalıdır"),
  pagesTo: z.coerce.number().min(1, "Bitiş sayfası en az 1 olmalıdır"),
  week: z.coerce.number().min(1, "Hafta en az 1 olmalıdır").max(52, "Hafta en fazla 52 olabilir"),
  classLevel: z.coerce.number().min(1, "Sınıf seviyesi en az 1 olmalıdır").max(5, "Sınıf seviyesi en fazla 5 olabilir"),
});

type LessonPlanFormData = z.infer<typeof lessonPlanFormSchema>;

export default function AddLessonPlanDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch program types for the dropdown
  const { data: programTypes = [] } = useQuery<ProgramType[]>({
    queryKey: ["/api/admin/program-types"],
  });

  const form = useForm<LessonPlanFormData>({
    resolver: zodResolver(lessonPlanFormSchema),
    defaultValues: {
      week: 1,
      subject: "",
      pagesFrom: 1,
      pagesTo: 10,
      classLevel: 1,
      programTypeId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LessonPlanFormData) => {
      const response = await apiRequest("POST", "/api/admin/lesson-plans", data);
      if (!response.ok) {
        throw new Error("Ders planı eklenirken hata oluştu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lesson-plans"] });
      toast({
        title: "Başarılı",
        description: "Yeni ders planı başarıyla oluşturuldu",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ders planı oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LessonPlanFormData) => {
    if (data.pagesFrom >= data.pagesTo) {
      toast({
        title: "Hata",
        description: "Bitiş sayfası başlangıç sayfasından büyük olmalıdır",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Ders Planı Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Ders Planı Oluştur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hafta</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Hafta numarası" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sınıf Seviyesi</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Sınıf seviyesi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ders Konusu</FormLabel>
                  <FormControl>
                    <Input placeholder="Ders konusu (örn: Kur'an-ı Kerim, Fıkıh)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pagesFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlangıç Sayfası</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Başlangıç sayfası" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pagesTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bitiş Sayfası</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Bitiş sayfası" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="programTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Türü</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Program türü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programTypes.map((programType) => (
                        <SelectItem key={programType.id} value={programType.id}>
                          {programType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
              >
                İptal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Oluşturuluyor..." : "Ders Planı Oluştur"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}