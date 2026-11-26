"use client";

import { useActionState, useEffect, useRef } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "@/app/admin/actions";

export default function FormGantiPassword() {
  const [state, formAction, sedangMemproses] = useActionState(gantiPassword, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex max-w-sm flex-col gap-4">
      <Input
        label="Password baru"
        name="password_baru"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        label="Ulangi password baru"
        name="konfirmasi_password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-bahaya bg-latar px-3 py-2 text-sm text-bahaya"
        >
          {state.error}
        </p>
      )}
      {state?.success && (
        <p
          role="status"
          className="rounded-lg border border-utama bg-permukaan px-3 py-2 text-sm text-utama"
        >
          {state.success}
        </p>
      )}
      <Tombol type="submit" className="self-start" disabled={sedangMemproses}>
        {sedangMemproses ? "Menyimpan..." : "Simpan password"}
      </Tombol>
    </form>
  );
}
