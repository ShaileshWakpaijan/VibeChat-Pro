import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { toastStyles } from "@/lib/ToastStyle";
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
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail } from "lucide-react";

export function VerifyOtp({
  isOpen,
  username,
  setIsOpen,
}: {
  isOpen: boolean;
  username: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const onClickHandler = async () => {
    let res = await useVerifyOtp({ username, otp });
    if (!res.success) {
      toast.error(<span>{res.message}</span>, {
        style: toastStyles.danger as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    toast.success(<span>OTP verification successful.</span>, {
      style: toastStyles.success as React.CSSProperties,
    });
    return router.push("/login");
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-fit bg-card flex flex-col items-center">
        <DialogHeader className="w-80 sm:w-[22rem] max-w-sm mx-2 shadow-md ">
          <DialogTitle className="text-2xl text-center flex justify-center">
            <div className=" bg-stone-700/30 p-4 rounded-full">
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
          <Button type="submit" className="w-full" onClick={onClickHandler}>
            Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
