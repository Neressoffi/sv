/**
 * Icônes modernes et fluides (Lucide) – style 2026
 * Taille et stroke cohérents pour une app mobile soignée.
 */

import {
  Heart,
  Home,
  Images,
  PlusCircle,
  User,
  LogOut,
  Inbox,
  Camera,
  Check,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react'

const defaultSize = 22
const defaultStroke = 1.75

const cn = (c) => `shrink-0 ${c || ''}`.trim()

export function IconHeart({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Heart fill="currentColor" size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconHome({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Home size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconImages({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Images size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconPlusCircle({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <PlusCircle size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconUser({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <User size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconLogOut({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <LogOut size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconInbox({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Inbox size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconCamera({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Camera size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconCheck({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Check size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconCheckCircle({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <CheckCircle2 size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconX({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <X size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
export function IconSparkles({ size = defaultSize, strokeWidth = defaultStroke, className, ...props }) {
  return <Sparkles size={size} strokeWidth={strokeWidth} className={cn(className)} aria-hidden {...props} />
}
