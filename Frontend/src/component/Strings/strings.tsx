import type { AlertProps } from "../../lib/type";

export const BooksFetchedAlertProps = {
  severity: "success",
  message: "Books fetched successfully!",
  color: "success",
  isVisible: true,
} as AlertProps;

export const BookUpdatedAlertProps = {
  severity: "success",
  message: "Book updated successfully!",
  color: "success",
  isVisible: true,
} as AlertProps;

export const BookAddedAlertProps = {
  severity: "success",
  message: "Book added successfully!",
  color: "success",
  isVisible: true,
} as AlertProps;

export const ErrorSavingBookAlertProps = {
  severity: "error",
  message: "Failed to save book. Please try again.",
  color: "error",
  isVisible: true,
} as AlertProps;

export const BookDeletedAlertProps = {
  severity: "success",
  message: "Book deleted successfully.",
  color: "warning",
  isVisible: true,
} as AlertProps;

export const BookNotFoundAlertProps = {
  severity: "error",
  message: "Error deleting book. Please try again.",
  color: "error",
  isVisible: true,
} as AlertProps;

export const BookMassEditAlertProps = {
  severity: "success",
  message: "Mass Edit Operation Successful!",
  color: "success",
  isVisible: true,
} as AlertProps;

export const BookMassEditErrorAlertProps = {
  severity: "error",
  message: "Mass Edit Operation Failed!",
  color: "error",
  isVisible: true,
} as AlertProps;
