"use client"

import { useRouter, useParams } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import { GBadge } from "@gal-ui/components";
import dayjs from "dayjs";

// Dummy campaign data - in real app, this would come from API
const campaignData: any = {
  1: {
    campaignName: "Campaign 1",
    status: "Draft",
    startDate: "5 Aug 2025, 10:00 AM",
    endDate: "5 Aug 2025, 11:00 AM",
    description: "This is a draft campaign",
    products: [
      {
        key: 1,
        productName: "Jersey Arsenal L",
        sku: "PROD0001",
        productPrice: "IDR 50.000",
        productQty: 500,
        discountType: "Percentage",
        discount: "50%",
        flashSaleQty: 50,
        finalPrice: "IDR 25.000",
      },
    ],
  },
  2: {
    campaignName: "Campaign 2",
    status: "Upcoming",
    startDate: "5 Aug 2025, 10:00 AM",
    endDate: "5 Aug 2025, 11:00 AM",
    description: "This is an upcoming campaign",
    products: [
      {
        key: 1,
        productName: "TWS ABC Super",
        sku: "PROD7718",
        productPrice: "IDR 60.000",
        productQty: 500,
        discountType: "Nominal",
        discount: "35.000",
        flashSaleQty: 80,
        finalPrice: "IDR 25.000",
      },
    ],
  },
  3: {
    campaignName: "Campaign 3",
    status: "Ongoing",
    startDate: "5 Aug 2025, 10:00 AM",
    endDate: "5 Aug 2025, 12:00 PM",
    description: "This is an ongoing campaign",
    products: [
      {
        key: 1,
        productName: "Macbook M1 Air",
        sku: "PROD7719",
        productPrice: "IDR 100.000",
        productQty: 500,
        discountType: "Percentage",
        discount: "10%",
        flashSaleQty: 12,
        finalPrice: "IDR 90.000",
      },
    ],
  },
  4: {
    campaignName: "Campaign 4",
    status: "Cancelled",
    startDate: "5 Aug 2025, 10:00 AM",
    endDate: "5 Aug 2025, 12:00 PM",
    description: "This campaign was cancelled",
    products: [],
  },
  5: {
    campaignName: "Campaign 5",
    status: "Ended",
    startDate: "5 Aug 2025, 10:00 AM",
    endDate: "5 Aug 2025, 12:00 PM",
    description: "This campaign has ended",
    products: [
      {
        key: 1,
        productName: "Raket Badminton",
        sku: "PROD6618",
        productPrice: "IDR 35.000",
        productQty: 500,
        discountType: "Nominal",
        discount: "30.000",
        flashSaleQty: 1,
        finalPrice: "IDR 5.000",
      },
    ],
  },
};

const ViewPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const campaign = campaignData[id];

  if (!campaign) {
    return <div className="p-[30px]">Campaign not found</div>;
  }

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

  const handlePublish = (data: any) => {
    console.log("Publish campaign:", data);
    // TODO: Implement publish logic
    router.push("/");
  };

  const handleCancel = (data: any) => {
    console.log("Cancel campaign:", data);
    // TODO: Implement cancel logic
    router.push("/");
  };

  // Determine mode based on status
  const mode = campaign.status === "Draft" ? "edit" : "view";

  // Convert date strings to dayjs objects for GDatePicker
  const initialData = {
    ...campaign,
    startDate: campaign.startDate ? dayjs(campaign.startDate) : undefined,
    endDate: campaign.endDate ? dayjs(campaign.endDate) : undefined,
  };

  // Get badge type based on status
  const getBadgeType = (status: string) => {
    switch (status) {
      case "Draft":
        return "gray";
      case "Upcoming":
        return "warning";
      case "Ongoing":
        return "success";
      case "Cancelled":
        return "error";
      case "Ended":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div>
      <div className="p-[30px] pb-0 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Campaign Details</h1>
        <GBadge type={getBadgeType(campaign.status) as any}>
          {campaign.status}
        </GBadge>
      </div>
      <CampaignForm
        mode={mode}
        status={campaign.status}
        initialData={initialData}
        onBack={handleBack}
        onSaveDraft={handleSaveDraft}
        onSaveSchedule={handleSaveSchedule}
        onPublish={handlePublish}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ViewPage;
