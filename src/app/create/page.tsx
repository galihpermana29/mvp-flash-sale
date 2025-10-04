"use client"

import { useRouter } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";

const CreatePage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const handleSaveDraft = (data: any) => {
    console.log("Save as draft:", data);
    // TODO: Implement save draft logic
    router.push("/");
  };

  const handleSaveSchedule = (data: any) => {
    console.log("Save as schedule:", data);
    // TODO: Implement save schedule logic
    router.push("/");
  };

  return (
    <CampaignForm
      mode="create"
      onBack={handleBack}
      onSaveDraft={handleSaveDraft}
      onSaveSchedule={handleSaveSchedule}
    />
  );
};

export default CreatePage;
