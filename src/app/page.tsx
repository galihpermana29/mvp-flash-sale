"use client"

import { GBadge, GButton, GDropdownButton, GInputSearch, GSegmented, GTable } from "@gal-ui/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

const dummyListCampaign = [{
  id: 1,
  campaignName: "Campaign 1",
  banner: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1759578593/istockphoto-1442792588-1024x1024_wceobb.jpg',
  status: "Draft",
  startDate: "5 Aug 2025, 10:00 AM",
  endDate: "5 Aug 2025, 11:00 AM",
}, {
  id: 2,
  campaignName: "Campaign 2",
  banner: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1759578593/istockphoto-1442792588-1024x1024_wceobb.jpg',
  status: "Upcoming",
  startDate: "5 Aug 2025, 10:00 AM",
  endDate: "5 Aug 2025, 11:00 AM",
}, {
  id: 3,
  campaignName: "Campaign 3",
  banner: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1759578593/istockphoto-1442792588-1024x1024_wceobb.jpg',
  status: "Ongoing",
  startDate: "5 Aug 2025, 10:00 AM",
  endDate: "5 Aug 2025, 12:00 PM",
}, {
  id: 4,
  campaignName: "Campaign 4",
  banner: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1759578593/istockphoto-1442792588-1024x1024_wceobb.jpg',
  status: "Cancelled",
  startDate: "5 Aug 2025, 10:00 AM",
  endDate: "5 Aug 2025, 12:00 PM",
}, {
  id: 5,
  campaignName: "Campaign 5",
  banner: 'https://res.cloudinary.com/dqipjpy1w/image/upload/v1759578593/istockphoto-1442792588-1024x1024_wceobb.jpg',
  status: "Ended",
  startDate: "5 Aug 2025, 10:00 AM",
  endDate: "5 Aug 2025, 12:00 PM",
}]

export default function Home() {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState("all");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Filter campaigns based on active segment
  const filteredCampaigns = activeSegment === "all"
    ? dummyListCampaign
    : dummyListCampaign.filter(campaign => campaign.status.toLowerCase() === activeSegment);

  const handleSchedule = () => {
    console.log("Schedule campaign:", selectedCampaign);
    setIsScheduleModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleRemove = () => {
    console.log("Remove campaign:", selectedCampaign);
    setIsRemoveModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleCancel = () => {
    console.log("Cancel campaign:", selectedCampaign);
    setIsCancelModalOpen(false);
    setSelectedCampaign(null);
  };

  const handlePublish = () => {
    console.log("Publish campaign:", selectedCampaign);
    setIsPublishModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleDownloadReport = (campaign: any) => {
    console.log("Download report for:", campaign);
    // TODO: Implement download report logic
  };

  const getActionItems = (record: any) => {
    const actions = [];

    if (record.status === "Draft") {
      actions.push(

        {
          label: "Edit",
          key: "edit",
          onClick: () => router.push(`/view/${record.id}`),
        },
        {
          label: "Schedule",
          key: "schedule",
          onClick: () => {
            setSelectedCampaign(record);
            setIsScheduleModalOpen(true);
          },
        },
        {
          label: "Remove",
          key: "remove",
          onClick: () => {
            setSelectedCampaign(record);
            setIsRemoveModalOpen(true);
          },
        }
      );
    } else if (record.status === "Upcoming") {
      actions.push(
        {
          label: "View",
          key: "view",
          onClick: () => router.push(`/view/${record.id}`),
        },
        {
          label: "Publish",
          key: "publish",
          onClick: () => {
            setSelectedCampaign(record);
            setIsPublishModalOpen(true);
          },
        },
        {
          label: "Cancel",
          key: "cancel",
          onClick: () => {
            setSelectedCampaign(record);
            setIsCancelModalOpen(true);
          },
        }
      );
    } else if (record.status === "Ongoing") {
      actions.push(
        {
          label: "View",
          key: "view",
          onClick: () => router.push(`/view/${record.id}`),
        },
        {
          label: "Cancel",
          key: "cancel",
          onClick: () => {
            setSelectedCampaign(record);
            setIsCancelModalOpen(true);
          },
        }
      );
    } else if (record.status === "Cancelled" || record.status === "Ended") {
      actions.push(
        {
          label: "View",
          key: "view",
          onClick: () => router.push(`/view/${record.id}`),
        },
        {
          label: "Download Report",
          key: "download",
          onClick: () => handleDownloadReport(record),
        }
      );
    }

    return actions;
  };

  const columns = [
    {
      title: "Banner",
      dataIndex: "banner",
      key: "banner",
      render: (text: string) => (
        <Image src={text} alt="banner" width={40} height={40} />
      ),
    }, {
      title: "Campaign Name",
      dataIndex: "campaignName",
      key: "campaignName",
    }, {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const getBadgeType = (status: string) => {
          switch (status) {
            case "Draft":
              return "gray";
            case "Upcoming":
              return "yellow";
            case "Ongoing":
              return "blue";
            case "Cancelled":
              return "red";
            case "Ended":
              return "default";
            default:
              return "default";
          }
        };

        return (
          <GBadge type={getBadgeType(status) as any}>
            {status}
          </GBadge>
        );
      },
    }, {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    }, {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    }, {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <GDropdownButton
            menu={{
              items: getActionItems(record)
            }}
          />
        )
      },
    }
  ]
  return (
    <div className="p-[30px]">
      <GSegmented
        onChange={(value: string) => setActiveSegment(value)}
        items={[
          {
            label: "All",
            key: "all",
          },
          {
            label: "Draft",
            key: "draft",
          },
          {
            label: "Upcoming",
            key: "upcoming",
          },
          {
            label: "Ongoing",
            key: "ongoing",
          },
          {
            label: "Cancelled",
            key: "cancelled",
          },
          {
            label: "Ended",
            key: "ended",
          },
        ]}
      />
      <GTable
        customHeader={
          <div className="flex items-center justify-between">
            <div className="w-[400px]">
              <GInputSearch placeholder="Search" />
            </div>
            <GButton btn_type="primary" onClick={() => router.push("/create")}>Add Campaign</GButton>
          </div>
        }
        columns={columns} dataSource={filteredCampaigns} />

      {/* Schedule Campaign Modal */}
      <ConfirmationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleSchedule}
        title="Schedule Campaign"
        description={`Are you sure you want to schedule "${selectedCampaign?.campaignName}"? The campaign will be set to Upcoming status.`}
        confirmText="Schedule"
        cancelText="Cancel"
        confirmButtonType="primary"
      />

      {/* Remove Campaign Modal */}
      <ConfirmationModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemove}
        title="Remove Campaign"
        description={`Are you sure you want to remove "${selectedCampaign?.campaignName}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmButtonType="destructive"
      />

      {/* Cancel Campaign Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Campaign"
        description={`Are you sure you want to cancel "${selectedCampaign?.campaignName}"? This will stop the campaign immediately.`}
        confirmText="Cancel Campaign"
        cancelText="Go Back"
        confirmButtonType="destructive"
      />

      {/* Publish Campaign Modal */}
      <ConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublish}
        title="Publish Campaign"
        description={`Are you sure you want to publish "${selectedCampaign?.campaignName}"? The campaign will go live immediately.`}
        confirmText="Publish"
        cancelText="Cancel"
        confirmButtonType="primary"
      />
    </div>
  );
}
