import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabs } from './src/components/BottomTabs';
import { LoginScreen } from './src/pages/LoginScreen';
import { ListsScreen } from './src/pages/ListsScreen';
import { ListDetailScreen } from './src/pages/ListDetailScreen';
import { SettingsScreen } from './src/pages/SettingsScreen';
import { styles } from './src/styles/appStyles';
import { createAuthService } from '@grocery/shared/src/services/mobile/authService';
import { createApiClient } from '@grocery/shared/src/services/mobile/apiClient';
import { createListApi } from '@grocery/shared/src/services/listApi';
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
} from '@grocery/shared/src/services/mobile/storage';
import config from './src/config';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState('');
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [listError, setListError] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [itemError, setItemError] = useState('');
  const [activeTab, setActiveTab] = useState('lists');
  const authService = createAuthService(config.apiBaseUrl);
  const apiClient = createApiClient({
    apiBaseUrl: config.apiBaseUrl,
    getAccessToken: () => accessToken,
    setAccessToken,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const storedRefreshToken = await getRefreshToken();
        if (!storedRefreshToken) {
          return;
        }
        await apiClient.refreshAccessToken();
      } catch {
        // ignore
      }
    };
    void init();
  }, []);

  const { authFetch } = apiClient;

  const loadLists = async () => {
    if (!accessToken) {
      return;
    }
    setIsLoadingLists(true);
    setListError('');
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      const data = await listService.getAll();
      setLists(data);
    } catch (err) {
      setListError(err?.message || 'Failed to load lists.');
    } finally {
      setIsLoadingLists(false);
    }
  };

  const loadListDetail = async (listId) => {
    if (!accessToken) {
      return;
    }
    setIsLoadingItems(true);
    setItemError('');
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      const data = await listService.getGroceryListById(listId);
      setSelectedList((prev) => ({
        ...(prev || {}),
        id: data.id,
        name: data.name,
      }));
      setItems(data.items || []);
    } catch (err) {
      setItemError(err?.message || 'Failed to load list.');
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleOpenList = async (list) => {
    setSelectedList(list);
    setItems([]);
    setItemName('');
    setActiveTab('current');
    await loadListDetail(list.id);
  };

  const handleAddItem = async () => {
    const trimmed = itemName.trim();
    if (!trimmed || !selectedList) {
      return;
    }
    setIsSubmitting(true);
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      await listService.addItem(selectedList.id, trimmed);
      setItemName('');
      await loadListDetail(selectedList.id);
    } catch (err) {
      setItemError(err?.message || 'Failed to add item.');
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const handleToggleItem = async (itemId) => {
    if (!selectedList) {
      return;
    }
    setIsSubmitting(true);
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      await listService.toggleComplete(itemId);
      await loadListDetail(selectedList.id);
    } catch (err) {
      setItemError(err?.message || 'Failed to toggle item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!selectedList) {
      return;
    }
    setIsSubmitting(true);
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      await listService.deleteItem(itemId);
      await loadListDetail(selectedList.id);
    } catch (err) {
      setItemError(err?.message || 'Failed to delete item.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleAddList = async () => {
    const trimmed = listName.trim();
    if (!trimmed) {
      return;
    }
    setIsSubmitting(true);
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      await listService.createList(trimmed);
      setListName('');
      await loadLists();
    } catch (err) {
      setListError(err?.message || 'Failed to create list.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteList = async (id) => {
    setIsSubmitting(true);
    try {
      const listService = createListApi(`${config.apiBaseUrl}/api`, authFetch);
      await listService.deleteList(id);
      await loadLists();
    } catch (err) {
      setListError(err?.message || 'Failed to delete list.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await authService.loginMobile({
        username: username.trim(),
        password,
      });
      if (data?.refreshToken) {
        await setRefreshToken(data.refreshToken);
      }
      if (data?.token) {
        setAccessToken(data.token);
      }
      setError('');
    } catch (err) {
      setError(err?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await authService.logoutMobile(refreshToken);
      }
    } catch {
      // ignore
    } finally {
      await clearRefreshToken();
      setAccessToken(null);
      setLists([]);
      setSelectedList(null);
      setItems([]);
    }
  };

  useEffect(() => {
    if (accessToken) {
      void loadLists();
    }
  }, [accessToken]);

  if (!accessToken) {
    return (
      <LoginScreen
        username={username}
        password={password}
        onChangeUsername={setUsername}
        onChangePassword={setPassword}
        onLogin={handleLogin}
        isSubmitting={isSubmitting}
        error={error}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appShell} edges={['top', 'bottom']}>
        <View style={styles.appContent}>
        {selectedList && activeTab === 'current' ? (
          <ListDetailScreen
            list={selectedList}
            items={items}
            itemName={itemName}
            onChangeItemName={setItemName}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            itemError={itemError}
            isLoadingItems={isLoadingItems}
            isSubmitting={isSubmitting}
          />
        ) : activeTab === 'lists' ? (
          <ListsScreen
            lists={lists}
            listName={listName}
            onChangeListName={setListName}
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
            onOpenList={handleOpenList}
            onLogout={handleLogout}
            isSubmitting={isSubmitting}
            isLoadingLists={isLoadingLists}
            listError={listError}
          />
        ) : activeTab === 'current' ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>Current List</Text>
            <Text style={styles.placeholderText}>
              Select a list from the Lists tab to view it here.
            </Text>
          </View>
        ) : (
          <SettingsScreen onLogout={handleLogout} />
        )}
      </View>

        <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
