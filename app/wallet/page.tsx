"use client";
import { useState } from "react";
import { App, Button, Form, Input, InputNumber, Modal, Radio, Tag } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

/** Static preview data — this build has no backend. "Request Withdrawal" opens
 * the same form UI but never submits anywhere; it just shows a notice. */
const BALANCE = 4250;

interface Transaction {
  _id: string;
  type: "win" | "withdrawal_request" | "withdrawal_approved" | "withdrawal_rejected";
  amount: number;
  createdAt: string;
}

const TYPE_LABEL: Record<Transaction["type"], string> = {
  win: "Prize won",
  withdrawal_request: "Withdrawal requested",
  withdrawal_approved: "Withdrawal paid out",
  withdrawal_rejected: "Withdrawal rejected (refunded)",
};

const TRANSACTIONS: Transaction[] = [
  { _id: "t1", type: "win", amount: 5000, createdAt: dayjs().subtract(1, "hour").toISOString() },
  { _id: "t2", type: "withdrawal_approved", amount: -2000, createdAt: dayjs().subtract(1, "day").toISOString() },
  { _id: "t3", type: "withdrawal_request", amount: -2000, createdAt: dayjs().subtract(1, "day").toISOString() },
  { _id: "t4", type: "win", amount: 1250, createdAt: dayjs().subtract(3, "day").toISOString() },
];

export default function WalletPage() {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [method, setMethod] = useState<"bank" | "upi">("bank");
  const [form] = Form.useForm();

  function openModal() {
    form.resetFields();
    setMethod("bank");
    setModalOpen(true);
  }

  async function handleSubmit() {
    await form.validateFields();
    setModalOpen(false);
    message.info("This is a UI — withdrawal requests aren't wired up here.");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-lg">
            <WalletOutlined />
          </div>
          <div>
            <div className="text-xs text-slate-400">Wallet Balance</div>
            <div className="text-2xl font-semibold text-slate-800">₹{BALANCE.toLocaleString("en-IN")}</div>
          </div>
        </div>
        <Button type="primary" onClick={openModal}>
          Request Withdrawal
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-medium text-slate-700 text-sm mb-3">Transaction History</h2>
        <div className="divide-y divide-slate-100">
          {TRANSACTIONS.map((t) => (
            <div key={t._id} className="py-2.5 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium text-slate-700">{TYPE_LABEL[t.type]}</div>
                <div className="text-xs text-slate-400">{dayjs(t.createdAt).format("DD MMM YYYY, hh:mm A")}</div>
              </div>
              <div className="text-right">
                <Tag color={t.amount >= 0 ? "green" : "default"}>
                  {t.amount >= 0 ? "+" : ""}
                  ₹{t.amount.toLocaleString("en-IN")}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Request Withdrawal"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Submit Request"
      >
        <p className="text-xs text-slate-400 mb-3">
          Approval and transfer can take up to 6 hours. Your request goes to the admin for review before payout.
        </p>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Amount (₹)"
            name="amount"
            rules={[
              { required: true, message: "Enter an amount" },
              {
                validator(_, value) {
                  if (value == null || value <= BALANCE) return Promise.resolve();
                  return Promise.reject(new Error("Cannot exceed your wallet balance."));
                },
              },
            ]}
          >
            <InputNumber className="w-full" min={1} max={BALANCE} placeholder="Enter amount" />
          </Form.Item>

          <Form.Item label="Withdraw To">
            <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)}>
              <Radio.Button value="bank">Bank Account</Radio.Button>
              <Radio.Button value="upi">UPI</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {method === "bank" ? (
            <>
              <Form.Item label="Account Holder Name" name="accountHolder" rules={[{ required: true, message: "Enter account holder name" }]}>
                <Input placeholder="As per bank records" />
              </Form.Item>
              <Form.Item label="Account Number" name="accountNumber" rules={[{ required: true, message: "Enter account number" }]}>
                <Input placeholder="Enter account number" />
              </Form.Item>
              <Form.Item label="IFSC Code" name="ifsc" rules={[{ required: true, message: "Enter IFSC code" }]}>
                <Input placeholder="Enter IFSC code" />
              </Form.Item>
            </>
          ) : (
            <Form.Item label="UPI ID" name="upiId" rules={[{ required: true, message: "Enter UPI ID" }]}>
              <Input placeholder="yourname@bank" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
