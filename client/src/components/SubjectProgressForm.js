"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubjectProgressForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var react_query_1 = require("@tanstack/react-query");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var form_1 = require("@/components/ui/form");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var progress_1 = require("@/components/ui/progress");
var lucide_react_1 = require("lucide-react");
var tr_1 = require("@/lib/tr");
var queryClient_1 = require("@/lib/queryClient");
var use_toast_1 = require("@/hooks/use-toast");
var zod_2 = require("zod");
var SURAHS = [
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
var temelBilgilerSchema = zod_2.z.object({
    pagesCompleted: zod_2.z.coerce.number().min(0, "Sayfa sayısı 0'dan küçük olamaz"),
});
var quranSchema = zod_2.z.object({
    quranPageNumber: zod_2.z.coerce.number().min(1, "Sayfa numarası 1'den küçük olamaz").max(604, "Mushaf'ta 604 sayfa vardır"),
});
var ezberSchema = zod_2.z.object({
    surahName: zod_2.z.string().min(1, "Sure seçimi zorunludur"),
    ayahNumber: zod_2.z.coerce.number().optional(),
});
var evaluationSchema = zod_2.z.object({
    behaviorType: zod_2.z.enum(['cok_dikkatli', 'dikkatli', 'orta', 'dikkatsiz', 'cok_dikkatsiz']),
    participation: zod_2.z.coerce.number().min(1).max(10),
    attention: zod_2.z.coerce.number().min(1).max(10),
    customNote: zod_2.z.string().optional(),
});
function SubjectProgressForm(_a) {
    var _this = this;
    var studentId = _a.studentId, studentName = _a.studentName, week = _a.week, plannedPages = _a.plannedPages, onSuccess = _a.onSuccess;
    var toast = (0, use_toast_1.useToast)().toast;
    var queryClient = (0, react_query_1.useQueryClient)();
    var temelForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(temelBilgilerSchema),
        defaultValues: { pagesCompleted: 0 }
    });
    var quranForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(quranSchema),
        defaultValues: { quranPageNumber: 1 }
    });
    var ezberForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(ezberSchema),
        defaultValues: { surahName: "", ayahNumber: undefined }
    });
    var evaluationForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(evaluationSchema),
        defaultValues: {
            behaviorType: "orta",
            participation: 5,
            attention: 5,
            customNote: ""
        }
    });
    var subjectProgressMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/teacher/subject-progress", __assign({ studentId: studentId, week: week, subject: data.subject }, data.progressData))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Başarılı",
                description: "Ders ilerlemesi kaydedildi",
            });
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        },
        onError: function () {
            toast({
                title: "Hata",
                description: "İlerleme kaydedilirken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var evaluationMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, queryClient_1.apiRequest)("POST", "/api/teacher/evaluation", __assign({ studentId: studentId, week: week }, data))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({
                title: "Başarılı",
                description: "Öğrenci değerlendirmesi kaydedildi",
            });
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        },
        onError: function () {
            toast({
                title: "Hata",
                description: "Değerlendirme kaydedilirken hata oluştu",
                variant: "destructive",
            });
        },
    });
    var calculateCompletionRate = function (completed) {
        if (!plannedPages)
            return 0;
        var totalPlanned = plannedPages.to - plannedPages.from + 1;
        return Math.min(100, Math.round((completed / totalPlanned) * 100));
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-5 w-5" }), studentName, " - Hafta ", week, " \u0130lerlemesi"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "temel-bilgiler", className: "w-full", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "temel-bilgiler", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Book, { className: "h-4 w-4" }), tr_1.tr.temelBilgiler] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "kuran", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-4 w-4" }), tr_1.tr.kuran] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "ezber", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-4 w-4" }), tr_1.tr.ezber] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "evaluation", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4" }), "De\u011Ferlendirme"] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "temel-bilgiler", className: "space-y-4", children: (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, temelForm, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: temelForm.handleSubmit(function (data) {
                                        return subjectProgressMutation.mutate({
                                            subject: "temel_bilgiler",
                                            progressData: data
                                        });
                                    }), className: "space-y-4", children: [plannedPages && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-muted rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium mb-2", children: tr_1.tr.weeklyPlan }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-muted-foreground", children: ["Planlanan: Sayfa ", plannedPages.from, "-", plannedPages.to, "(", plannedPages.to - plannedPages.from + 1, " sayfa)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)(progress_1.Progress, { value: calculateCompletionRate(temelForm.watch("pagesCompleted")), className: "h-2" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-muted-foreground mt-1", children: ["%", calculateCompletionRate(temelForm.watch("pagesCompleted")), " tamamland\u0131"] })] })] })), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: temelForm.control, name: "pagesCompleted", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: tr_1.tr.pagesCompleted }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: tr_1.tr.enterCompletedPages }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", disabled: subjectProgressMutation.isPending, className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }), subjectProgressMutation.isPending ? "Kaydediliyor..." : tr_1.tr.saveSubjectProgress] })] }) })) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "kuran", className: "space-y-4", children: (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, quranForm, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: quranForm.handleSubmit(function (data) {
                                        return subjectProgressMutation.mutate({
                                            subject: "kuran",
                                            progressData: data
                                        });
                                    }), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-muted rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium mb-2", children: tr_1.tr.quranProgress }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "\u00D6\u011Frencinin Mushaf'ta ula\u015Ft\u0131\u011F\u0131 son sayfay\u0131 kaydedin" })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: quranForm.control, name: "quranPageNumber", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: tr_1.tr.mushafPage }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: tr_1.tr.enterQuranPage, min: "1", max: "604" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", disabled: subjectProgressMutation.isPending, className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }), subjectProgressMutation.isPending ? "Kaydediliyor..." : tr_1.tr.saveSubjectProgress] })] }) })) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "ezber", className: "space-y-4", children: (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, ezberForm, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: ezberForm.handleSubmit(function (data) {
                                        return subjectProgressMutation.mutate({
                                            subject: "ezber",
                                            progressData: data
                                        });
                                    }), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-muted rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium mb-2", children: tr_1.tr.ezberProgress }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "\u00D6\u011Frencinin ezberlemekte oldu\u011Fu sure ve ayet bilgilerini girin" })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: ezberForm.control, name: "surahName", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: tr_1.tr.surah }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: tr_1.tr.selectSurah }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { className: "max-h-60", children: SURAHS.map(function (surah, index) { return ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: surah, children: [index + 1, ". ", surah] }, surah)); }) })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: ezberForm.control, name: "ayahNumber", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: tr_1.tr.ayahNumber }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", placeholder: tr_1.tr.enterAyahNumber }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", disabled: subjectProgressMutation.isPending, className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }), subjectProgressMutation.isPending ? "Kaydediliyor..." : tr_1.tr.saveSubjectProgress] })] }) })) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "evaluation", className: "space-y-4", children: (0, jsx_runtime_1.jsx)(form_1.Form, __assign({}, evaluationForm, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: evaluationForm.handleSubmit(function (data) {
                                        return evaluationMutation.mutate(data);
                                    }), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-muted rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium mb-2", children: tr_1.tr.studentEvaluation }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "\u00D6\u011Frencinin haftal\u0131k davran\u0131\u015F ve performans de\u011Ferlendirmesi" })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: evaluationForm.control, name: "behaviorType", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: tr_1.tr.behaviorAssessment }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, defaultValue: field.value, children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "cok_dikkatli", children: tr_1.tr.behaviorTypes.cok_dikkatli }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "dikkatli", children: tr_1.tr.behaviorTypes.dikkatli }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "orta", children: tr_1.tr.behaviorTypes.orta }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "dikkatsiz", children: tr_1.tr.behaviorTypes.dikkatsiz }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "cok_dikkatsiz", children: tr_1.tr.behaviorTypes.cok_dikkatsiz })] })] }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: evaluationForm.control, name: "participation", render: function (_a) {
                                                        var field = _a.field;
                                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsxs)(form_1.FormLabel, { children: [tr_1.tr.participation, " (1-10)"] }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", min: "1", max: "10" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                                    } }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: evaluationForm.control, name: "attention", render: function (_a) {
                                                        var field = _a.field;
                                                        return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsxs)(form_1.FormLabel, { children: [tr_1.tr.attention, " (1-10)"] }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, __assign({ type: "number", min: "1", max: "10" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                                    } })] }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: evaluationForm.control, name: "customNote", render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: tr_1.tr.customNote }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(textarea_1.Textarea, __assign({ placeholder: "Bu hafta \u00F6\u011Frencinin durumu hakk\u0131nda notlar...", className: "resize-none" }, field)) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] }));
                                            } }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", disabled: evaluationMutation.isPending, className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }), evaluationMutation.isPending ? "Kaydediliyor..." : tr_1.tr.saveEvaluation] })] }) })) })] }) })] }));
}
