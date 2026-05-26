import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import Svg, { Path, Line } from "react-native-svg";
import { theme } from "../styles/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const EyeIcon: React.FC<{ visible: boolean }> = ({ visible }) => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M1.5465 8.73903C1.48399 8.90741 1.48399 9.09264 1.5465 9.26103C2.15527 10.7371 3.18863 11.9992 4.51558 12.8874C5.84252 13.7755 7.40328 14.2496 9 14.2496C10.5967 14.2496 12.1575 13.7755 13.4844 12.8874C14.8114 11.9992 15.8447 10.7371 16.4535 9.26103C16.516 9.09264 16.516 8.90741 16.4535 8.73903C15.8447 7.26292 14.8114 6.00081 13.4844 5.1127C12.1575 4.22459 10.5967 3.75049 9 3.75049C7.40328 3.75049 5.84252 4.22459 4.51558 5.1127C3.18863 6.00081 2.15527 7.26292 1.5465 8.73903Z"
      stroke="#99A1AF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
      stroke="#99A1AF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {visible && (
      <Line
        x1={3.5} y1={3} x2={14.5} y2={15}
        stroke="#99A1AF"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    )}
  </Svg>
);

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  secureTextEntry,
  style,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const hasRight = secureTextEntry || rightIcon;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            icon ? styles.inputWithLeftIcon : styles.inputNoLeftIcon,
            hasRight ? styles.inputWithRightIcon : styles.inputNoRightIcon,
            ...(style ? [style] : []),
          ]}
          placeholderTextColor="#99A1AF"
          secureTextEntry={isSecure}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setIsSecure(!isSecure)}
          >
            <EyeIcon visible={!isSecure} />
          </TouchableOpacity>
        )}
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={styles.errorText}>{`⚠️ ${error}`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
    color: "#364153",
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    height: 50,
    position: "relative",
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputNoLeftIcon: {
    paddingLeft: 16,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  inputNoRightIcon: {
    paddingRight: 16,
  },
  iconLeft: {
    position: "absolute",
    left: 12,
    top: 16,
  },
  iconRight: {
    position: "absolute",
    right: 12,
    top: 16,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.danger,
    marginTop: 6,
  },
});
