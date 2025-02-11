import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

interface Props {
  triggerTitle: React.ReactNode;
  confirmButton: React.ReactNode;
  dialogDescription: React.ReactNode;
  termsAccepted: boolean;
  setTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  reqLoading: boolean;
}

const ConfirmActionAlert = ({
  triggerTitle,
  confirmButton,
  dialogDescription,
  setTermsAccepted,
  termsAccepted,
  reqLoading,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerTitle}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Agree to continue</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex justify-between w-full">
            <div className="items-top flex space-x-2">
              <Checkbox
                id="terms1"
                checked={termsAccepted}
                onClick={(e: any) => {
                  e.preventDefault();
                  setTermsAccepted((prevState) => !prevState);
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
            </div>
            <div>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              {confirmButton}
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmActionAlert;
