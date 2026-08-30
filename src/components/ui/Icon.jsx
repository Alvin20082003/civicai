import React from "react";
import {
  Eye, ShieldCheck, Scale, Lock, Sparkles, FileCheck, ShieldAlert, Gauge,
  TrendingUp, TrendingDown, Check, BadgeCheck, GitBranch, UserCheck,
  FileText, HeartPulse, Car, GraduationCap, Briefcase, Receipt,
  FileQuestion, Lightbulb, Send, User, MessageSquare, BookCheck,
  Database, Landmark, LineChart, Activity, AlertTriangle, CheckCircle2,
  Clock, Bell, Settings, LogOut, Search, ChevronRight, ChevronDown,
  Menu, X, ArrowRight, ArrowUpRight, FileSearch, Cpu, Network,
  Layers, Workflow, FileClock, Users, Building2, BarChart3, PieChart,
  Zap, Globe, KeyRound, Fingerprint, ScrollText, Gavel, Target,
  Brain, Bot, MessageCircle, Plus, Filter, Download, ExternalLink,
  CircleDot, AlertCircle, Info, Shield, FileBadge, Stamp, IdCard,
  Wallet, House, Stethoscope, GraduationCap as GradCap, Bus, Calendar,
  Star, ArrowLeft, MoreHorizontal, RefreshCw, LayoutGrid,
  Mic, Square, Circle, Volume2, BellOff, Languages
} from "lucide-react";

const iconMap = {
  Eye, ShieldCheck, Scale, Lock, Sparkles, FileCheck, ShieldAlert, Gauge,
  TrendingUp, TrendingDown, Check, BadgeCheck, GitBranch, UserCheck,
  FileText, HeartPulse, Car, GraduationCap, Briefcase, Receipt,
  FileQuestion, Lightbulb, Send, User, MessageSquare, BookCheck,
  Database, Landmark, LineChart, Activity, AlertTriangle, CheckCircle2,
  Clock, Bell, Settings, LogOut, Search, ChevronRight, ChevronDown,
  Menu, X, ArrowRight, ArrowUpRight, FileSearch, Cpu, Network,
  Layers, Workflow, FileClock, Users, Building2, BarChart3, PieChart,
  Zap, Globe, KeyRound, Fingerprint, ScrollText, Gavel, Target,
  Brain, Bot, MessageCircle, Plus, Filter, Download, ExternalLink,
  CircleDot, AlertCircle, Info, Shield, FileBadge, Stamp, IdCard,
  Wallet, House, Stethoscope, GradCap, Bus, Calendar,
  Star, ArrowLeft, MoreHorizontal, RefreshCw, LayoutGrid,
  Mic, Square, Circle, Volume2, BellOff, Languages
};

export default function Icon({ name, className, strokeWidth = 2 }) {
  const LucideIcon = iconMap[name] || Activity;
  return <LucideIcon className={className} strokeWidth={strokeWidth} />;
}