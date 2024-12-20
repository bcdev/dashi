import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  type DialogContentProps,
  DialogContentText,
  type DialogProps as MuiDialogProps,
  DialogTitle,
  type DialogTitleProps,
} from "@mui/material";

import type { TypographyProps } from "@mui/material/Typography";
import { Children, type ComponentProps, type ComponentState } from "@/index";

interface DialogState extends ComponentState {
  open?: boolean;
  title?: string;
  titleProps?: DialogTitleProps & TypographyProps;
  content?: string;
  contentProps?: DialogContentProps & TypographyProps;
  disableEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth?: MuiDialogProps["maxWidth"];
  scroll?: MuiDialogProps["scroll"];
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

interface DialogProps extends ComponentProps, DialogState {}

export const Dialog = ({
  id,
  type,
  style,
  open,
  title,
  titleProps,
  content,
  contentProps,
  disableEscapeKeyDown,
  fullScreen,
  fullWidth,
  maxWidth,
  scroll,
  ariaLabel,
  ariaDescribedBy,
  children: nodes,
  onChange,
}: DialogProps) => {
  if (!open) {
    return;
  }
  const handleClose: MuiDialogProps["onClose"] = (_event, _reason) => {
    if (id) {
      onChange({
        componentType: type,
        id: id,
        property: "open",
        value: false,
      });
    }
  };

  return (
    <MuiDialog
      id={id}
      style={style}
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll={scroll}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {title && (
        <>
          <DialogTitle {...titleProps}>{title}</DialogTitle>
        </>
      )}
      {content && (
        <>
          <DialogContent {...contentProps}>
            <DialogContentText>{content}</DialogContentText>
          </DialogContent>
        </>
      )}
      {nodes && (
        <DialogActions>
          <Children nodes={nodes} onChange={onChange} />
        </DialogActions>
      )}
    </MuiDialog>
  );
};
