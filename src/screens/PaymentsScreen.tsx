import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAppLanguage } from '../i18n/LanguageProvider';
import { TVKColors } from '../theme';

type BillStatus = 'due' | 'overdue' | 'paid';

type Bill = {
  id: string;
  title: string;
  provider: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
};

type PaymentMethod = {
  id: string;
  label: string;
  subtitle: string;
};

const BILLS: Bill[] = [
  {
    id: 'ELEC-0021',
    title: 'Electricity Bill',
    provider: 'TANGEDCO',
    amount: 1240,
    dueDate: '28 Apr 2026',
    status: 'due',
  },
  {
    id: 'WTR-1015',
    title: 'Water Charges',
    provider: 'Chennai Metro Water',
    amount: 420,
    dueDate: '02 May 2026',
    status: 'due',
  },
  {
    id: 'TAX-8831',
    title: 'Property Tax',
    provider: 'Greater Chennai Corporation',
    amount: 3500,
    dueDate: '24 Apr 2026',
    status: 'overdue',
  },
];

const METHODS: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', subtitle: 'subhash@upi' },
  { id: 'card', label: 'Debit Card', subtitle: '•••• 4821' },
  { id: 'wallet', label: 'Wallet', subtitle: 'Vettri Wallet' },
];

const statusStyle = (status: BillStatus) => {
  if (status === 'paid') {
    return { bg: TVKColors.successLight, text: TVKColors.success, label: 'Paid' };
  }
  if (status === 'overdue') {
    return { bg: TVKColors.errorLight, text: TVKColors.error, label: 'Overdue' };
  }
  return { bg: TVKColors.accentLight, text: TVKColors.accentDark, label: 'Due' };
};

const PaymentsScreen: React.FC = () => {
  const { strings } = useAppLanguage();
  const [selectedBillId, setSelectedBillId] = useState(BILLS[0].id);
  const [selectedMethodId, setSelectedMethodId] = useState(METHODS[0].id);

  const dueBills = useMemo(() => BILLS.filter(b => b.status !== 'paid'), []);
  const selectedBill = dueBills.find(b => b.id === selectedBillId) ?? dueBills[0];
  const totalDue = dueBills.reduce((acc, bill) => acc + bill.amount, 0);

  const payNow = () => {
    if (!selectedBill) return;
    const reference = `VTN-${Math.floor(Math.random() * 900000 + 100000)}`;
    Alert.alert(
      'Payment Successful',
      `${selectedBill.title} paid successfully.\nReference: ${reference}`,
    );
  };

  return (
    <View className="flex-1 bg-tvk-background">
      <ScreenHeader
        title={strings.routes.payments}
        subtitle="Secure digital bill payments for citizen services"
        leftAction="auto"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4">
          <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-tvk-text-secondary">
            Amount Due
          </Text>
          <Text className="mt-2 text-[28px] font-bold text-tvk-primary">₹{totalDue.toFixed(2)}</Text>
          <Text className="mt-1 text-[12px] text-tvk-text-secondary">
            {dueBills.length} active bills for this month
          </Text>
        </Card>

        <Text className="mb-2 text-[16px] font-semibold text-tvk-text-primary">Pending Bills</Text>
        {dueBills.map(bill => {
          const selected = bill.id === selectedBillId;
          const status = statusStyle(bill.status);

          return (
            <TouchableOpacity
              key={bill.id}
              activeOpacity={0.85}
              onPress={() => setSelectedBillId(bill.id)}
              className="mb-3 rounded-[16px] border bg-tvk-surface px-4 py-3"
              style={{
                borderColor: selected ? TVKColors.primary : TVKColors.border,
                shadowColor: TVKColors.redDark,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: selected ? 0.14 : 0.08,
                shadowRadius: 12,
                elevation: selected ? 3 : 1,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-[15px] font-semibold text-tvk-text-primary">{bill.title}</Text>
                  <Text className="mt-0.5 text-[12px] text-tvk-text-secondary">{bill.provider}</Text>
                  <Text className="mt-2 text-[12px] text-tvk-text-tertiary">Due: {bill.dueDate}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[17px] font-bold text-tvk-text-primary">
                    ₹{bill.amount.toFixed(2)}
                  </Text>
                  <View
                    className="mt-2 rounded-full px-2.5 py-1"
                    style={{ backgroundColor: status.bg }}
                  >
                    <Text className="text-[10px] font-semibold" style={{ color: status.text }}>
                      {status.label}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <Text className="mb-2 mt-2 text-[16px] font-semibold text-tvk-text-primary">
          Select Payment Method
        </Text>
        <Card className="mb-4">
          {METHODS.map(method => {
            const active = method.id === selectedMethodId;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.85}
                onPress={() => setSelectedMethodId(method.id)}
                className="mb-2 flex-row items-center justify-between rounded-[14px] border px-3 py-3"
                style={{
                  borderColor: active ? TVKColors.primary : TVKColors.border,
                  backgroundColor: active ? TVKColors.primaryLight : TVKColors.surface,
                }}
              >
                <View>
                  <Text
                    className="text-[14px] font-semibold"
                    style={{ color: active ? TVKColors.primaryDark : TVKColors.textPrimary }}
                  >
                    {method.label}
                  </Text>
                  <Text className="mt-0.5 text-[12px] text-tvk-text-secondary">{method.subtitle}</Text>
                </View>
                <View
                  className="h-5 w-5 rounded-full border-2"
                  style={{
                    borderColor: active ? TVKColors.primary : TVKColors.border,
                    backgroundColor: active ? TVKColors.primary : TVKColors.white,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </Card>

        <PrimaryButton label="Pay Selected Bill" onPress={payNow} fullWidth />

        <Text className="mb-2 mt-5 text-[16px] font-semibold text-tvk-text-primary">Recent Payments</Text>
        <Card>
          {[
            { title: 'Birth Certificate Fee', amount: 60, date: '20 Apr 2026' },
            { title: 'Water Charges', amount: 410, date: '12 Apr 2026' },
          ].map(item => (
            <View
              key={`${item.title}-${item.date}`}
              className="mb-2 flex-row items-center justify-between border-b border-tvk-border pb-2"
            >
              <View>
                <Text className="text-[13px] font-medium text-tvk-text-primary">{item.title}</Text>
                <Text className="text-[11px] text-tvk-text-tertiary">{item.date}</Text>
              </View>
              <Text className="text-[13px] font-semibold text-tvk-success">₹{item.amount}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

export default PaymentsScreen;
