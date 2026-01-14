import { ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { styles } from "./button.styles";
import { colors } from "@/constants/theme";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children?: ReactNode;
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  danger: styles.variantDanger,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  success: styles.variantSuccess,
};

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
  primary: styles.textPrimary,
  secondary: styles.textSecondary,
  danger: styles.textDanger,
  outline: styles.textOutline,
  ghost: styles.textGhost,
  success: styles.textSuccess,
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: styles.textSm,
  md: styles.textMd,
  lg: styles.textLg,
};

const loaderColors: Record<ButtonVariant, string> = {
  primary: colors.dark.primary,
  secondary: colors.dark.text,
  danger: "#FFFFFF",
  outline: colors.dark.text,
  ghost: colors.dark.accent,
  success: "#FFFFFF",
};

export default function Button({
  children,
  title,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconOnly = false,
  onPress,
  style,
  textStyle,
  activeOpacity = 0.8,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    iconOnly && size === "lg" && styles.iconOnlyLg,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    textSizeStyles[size],
    textVariantStyles[variant],
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={loaderColors[variant]} />;
    }

    if (children) {
      return children;
    }

    return (
      <>
        {icon}
        {title && !iconOnly && <Text style={textStyles}>{title}</Text>}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
