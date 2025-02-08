import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { generatePR } from "./pr_writer";

const Index = () => {
  const [pr, setPR] = useState("");
  const { register, handleSubmit } = useForm();

  const mutation = useMutation(generatePR, {
    onSuccess: (data) => setPR(data),
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log(pr);
    }
  }, [mutation.isSuccess, pr]);

  return (
    <div>
      <h1>スキル入力フォーム</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <input {...register("name")} placeholder="名前" />
        <input {...register("skills")} placeholder="スキル" />
        <input {...register("experience")} placeholder="経験年数" />
        <input {...register("industry")} placeholder="業界" />
        <button type="submit">生成</button>
      </form>
      <h1>プレビュー画面</h1>
      <div>{pr}</div>
    </div>
  );
};

export default Index;