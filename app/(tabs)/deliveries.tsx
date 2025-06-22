import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';

import { useDeliveries } from '@/context/DeliveryContext';
import { ThemedText } from '@/components/ThemedText';

export default function DeliveriesScreen() {
  const { deliveries, addDelivery, location } = useDeliveries();
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();

  const pickImage = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const submit = () => {
    if (!client || !amount || !address) return;
    addDelivery({ client, amount: parseFloat(amount), address, photoUri: photo, location });
    setClient('');
    setAmount('');
    setAddress('');
    setPhoto(undefined);
  };

  const total = deliveries.reduce((sum, d) => sum + d.amount, 0);

  return (
    <View style={styles.container}>
      <ThemedText type="title">Repartos</ThemedText>
      <TextInput
        placeholder="Cliente"
        value={client}
        onChangeText={setClient}
        style={styles.input}
      />
      <TextInput
        placeholder="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Button title="Tomar foto" onPress={pickImage} />
      {photo && <Image source={{ uri: photo }} style={styles.photo} />}
      <Button title="Agregar" onPress={submit} />
      <ThemedText type="subtitle">Total: ${total.toFixed(2)}</ThemedText>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText>{item.client}</ThemedText>
            <ThemedText>${item.amount.toFixed(2)}</ThemedText>
            {item.photoUri && (
              <Image source={{ uri: item.photoUri }} style={styles.itemPhoto} />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  photo: { width: 200, height: 200, marginVertical: 8 },
  item: { marginVertical: 4 },
  itemPhoto: { width: 50, height: 50 },
});
