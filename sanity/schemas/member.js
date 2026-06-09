export default {
  name: "member",
  title: "Member",
  type: "document",
  fields: [
    { 
      name: "name", 
      title: "Full Name", 
      type: "string", 
      validation: (Rule) => Rule.required() 
    },
    { 
      name: "email", 
      title: "Email", 
      type: "string", 
      validation: (Rule) => Rule.required().email() 
    },
    { 
      name: "phone", 
      title: "Phone / WhatsApp", 
      type: "string" 
    },
    { 
      name: "company", 
      title: "Company", 
      type: "string" 
    },
    { 
      name: "title", 
      title: "Job Title", 
      type: "string" 
    },
    {
      name: "tier",
      title: "Membership Tier",
      type: "string",
      options: { 
        list: [
          { title: "🥉 Bronze", value: "bronze" },
          { title: "🥈 Silver", value: "silver" },
          { title: "🥇 Gold", value: "gold" },
          { title: "💎 Platinum", value: "platinum" },
          { title: "💠 Diamond", value: "diamond" }
        ] 
      },
      validation: (Rule) => Rule.required(),
      initialValue: "bronze"
    },
    {
      name: "status",
      title: "Membership Status",
      type: "string",
      options: { 
        list: [
          { title: "⏳ Pending Approval", value: "pending" },
          { title: "✅ Active", value: "active" },
          { title: "❌ Rejected", value: "rejected" },
          { title: "⚠️ Suspended", value: "suspended" }
        ] 
      },
      validation: (Rule) => Rule.required(),
      initialValue: "pending"
    },
    { 
      name: "paymentMethod", 
      title: "Payment Method", 
      type: "string",
      options: { 
        list: [
          { title: "🏦 Bank Transfer / FPS", value: "bank_transfer" },
          { title: "💳 Stripe", value: "stripe" },
          { title: "🅿️ PayPal", value: "paypal" },
          { title: "💰 Crypto", value: "crypto" },
          { title: "📝 Manual / Offline", value: "manual" }
        ] 
      }
    },
    { 
      name: "paymentStatus", 
      title: "Payment Status", 
      type: "string",
      options: { 
        list: [
          { title: "⏳ Unpaid", value: "unpaid" },
          { title: "✅ Paid", value: "paid" },
          { title: "⚠️ Partial", value: "partial" },
          { title: "💸 Refunded", value: "refunded" }
        ] 
      },
      initialValue: "unpaid"
    },
    { 
      name: "paymentAmount", 
      title: "Payment Amount (USD)", 
      type: "number" 
    },
    { 
      name: "paymentDate", 
      title: "Payment Date", 
      type: "datetime" 
    },
    { 
      name: "transactionId", 
      title: "Transaction ID / Reference", 
      type: "string" 
    },
    {
      name: "joinedDate",
      title: "Joined Date",
      type: "datetime",
      initialValue: "now"
    },
    { 
      name: "notes", 
      title: "Admin Notes", 
      type: "text", 
      rows: 4 
    },
    {
      name: "verified",
      title: "✅ Verified (Asset/Income Check)",
      type: "boolean",
      initialValue: false
    },
    {
      name: "telegramHandle",
      title: "Telegram Handle",
      type: "string",
      description: "e.g., @username"
    },
    {
      name: "linkedinUrl",
      title: "LinkedIn Profile",
      type: "url"
    }
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tier",
      media: "logo"
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        subtitle: subtitle ? `${subtitle}` : "Member"
      }
    }
  }
};
