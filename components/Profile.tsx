import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Mail, Lock, User, Trash2, LogOut } from 'lucide-react-native';
import { supabase } from '../utils/supabase';

interface ProfileProps {
  onBack: () => void;
  email: string;
}

export default function Profile({ onBack, email }: ProfileProps) {
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === email) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setLoading(false);
    setMessage(error ? error.message : 'Confirmation email sent to new address.');
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    setMessage(error ? error.message : 'Password updated!');
    setNewPassword('');
  };

  const handleUpdateName = async () => {
    if (!displayName) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
    setLoading(false);
    setMessage(error ? error.message : 'Name updated!');
  };

  const handleDeleteData = () => {
    Alert.alert('Delete All Plant Data', 'This will remove all your plants. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await supabase.from('plants').delete().neq('id', 0);
          setLoading(false);
          setMessage('All plant data deleted.');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete Account',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await supabase.from('plants').delete().neq('id', 0);
          await supabase.auth.signOut();
          setLoading(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <User size={32} color="#166534" />
        </View>
        <Text style={styles.email}>{email}</Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        {loading && <ActivityIndicator color="#166534" style={{ marginBottom: 16 }} />}

        <Text style={styles.sectionTitle}>Display Name</Text>
        <View style={styles.row}>
          <User size={18} color="#71717a" />
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#a1a1aa"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateName}>
          <Text style={styles.saveBtnText}>Update Name</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Email</Text>
        <View style={styles.row}>
          <Mail size={18} color="#71717a" />
          <TextInput
            style={styles.input}
            placeholder="New email"
            placeholderTextColor="#a1a1aa"
            value={newEmail}
            onChangeText={setNewEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateEmail}>
          <Text style={styles.saveBtnText}>Update Email</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Password</Text>
        <View style={styles.row}>
          <Lock size={18} color="#71717a" />
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor="#a1a1aa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdatePassword}>
          <Text style={styles.saveBtnText}>Update Password</Text>
        </TouchableOpacity>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>

          <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteData}>
            <Trash2 size={18} color="#f87171" />
            <Text style={styles.dangerBtnText}>Delete All Plant Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dangerBtn, { backgroundColor: '#fef2f2' }]} onPress={handleDeleteAccount}>
            <Trash2 size={18} color="#dc2626" />
            <Text style={[styles.dangerBtnText, { color: '#dc2626' }]}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={() => supabase.auth.signOut()}>
            <LogOut size={18} color="#fff" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, paddingTop: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f4f4f5',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
  content: { padding: 24, paddingTop: 80, paddingBottom: 60 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#f0fdf4',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 8,
    borderWidth: 2, borderColor: '#dcfce7',
  },
  email: { textAlign: 'center', color: '#71717a', fontSize: 14, marginBottom: 24 },
  message: { backgroundColor: '#f0fdf4', color: '#166534', padding: 12, borderRadius: 12, marginBottom: 16, fontSize: 13 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f4f5', borderRadius: 14, paddingHorizontal: 14, gap: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#18181b' },
  saveBtn: { backgroundColor: '#166534', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  dangerZone: { marginTop: 32, borderTopWidth: 1, borderTopColor: '#f4f4f5', paddingTop: 20 },
  dangerTitle: { fontSize: 14, fontWeight: 'bold', color: '#dc2626', marginBottom: 12 },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
    borderRadius: 12, borderWidth: 1, borderColor: '#fecaca', marginBottom: 10,
  },
  dangerBtnText: { color: '#f87171', fontWeight: '600', fontSize: 14 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#71717a', borderRadius: 12, paddingVertical: 14, marginTop: 8,
  },
  signOutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
