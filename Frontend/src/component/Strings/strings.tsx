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

export const BookCannotBeSavedAlertProps = {
  severity: "error",
  message: "Failed to make changes. Please try again.",
  color: "error",
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

export const BookMassEditNeedChangesWarnAlertProps = {
  severity: "warning",
  message: "Mass Edit needs any edits to be made for the selected records",
  color: "warning",
  isVisible: true,
} as AlertProps;

export const UserLoggedInAlertProps = {
  severity: "success",
  message: "Logged In Successfully",
  color: "success",
  isVisible: true,
} as AlertProps;

export const UserRegisteredAlertProps = {
  severity: "success",
  message: "Registered Successfully",
  color: "success",
  isVisible: true,
} as AlertProps;

export const UserLoggedOutAlertProps = {
  severity: "info",
  message: "Logged Out Successfully",
  color: "error",
  isVisible: true,
} as AlertProps;

export const SaveNewRecordsBeforeMassEditAlertProps = {
  severity: "warning",
  message: "Please save new records before mass edit.",
  color: "warning",
  isVisible: true,
} as AlertProps;
