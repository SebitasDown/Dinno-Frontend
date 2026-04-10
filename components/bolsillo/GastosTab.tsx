import React from 'react';
import { View } from 'react-native';
import { TransactionList } from './TransactionList';

export const GastosTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <TransactionList />
    </View>
  );
};
