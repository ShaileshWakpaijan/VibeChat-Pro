import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2, Mail } from "lucide-react";

export function VerifyOtp({
  isOpen,
  setIsOpen,
  verifyOTPFn,
}: {
  isOpen: boolean;
  username: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  verifyOTPFn: (
    otp: string,
    setOTPLoading: Dispatch<SetStateAction<boolean>>,
  ) => Promise<void>;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="w-fit bg-card flex flex-col items-center"
      >
        <DialogHeader className="w-80 sm:w-88 max-w-sm mx-2">
          <DialogTitle className="text-2xl text-center flex justify-center">
            <div className=" bg-stone-700/10 dark:bg-stone-700/30 p-4 rounded-full">
              <Mail />
            </div>
          </DialogTitle>
          <DialogTitle className="text-xl text-center">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className=" text-center">
            Enter 6-digit verification code that sent to your email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="w-full flex justify-between gap-2">
              <InputOTPSlot
                index={0}
                className="rounded-md border p-[1.12rem] sm:p-5"
              />
              <InputOTPSlot
                index={1}
                className="rounded-md border p-[1.12rem] sm:p-5"
              />
              <InputOTPSlot
                index={2}
                className="rounded-md border p-[1.12rem] sm:p-5"
              />
              <InputOTPSlot
                index={3}
                className="rounded-md border p-[1.12rem] sm:p-5"
              />
              <InputOTPSlot
                index={4}
                className="rounded-md border p-[1.12rem] sm:p-5"
              />
              <InputOTPSlot
                index={5}
                className="rounded-md border p-[1.12rem] sm:p-5"
              />
            </InputOTPGroup>
          </InputOTP>
          <Button
            disabled={loading}
            type="submit"
            className="w-full"
            onClick={() => verifyOTPFn(otp, setLoading)}
          >
            {loading ? <Loader2 className=" animate-spin" /> : "Verify"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
