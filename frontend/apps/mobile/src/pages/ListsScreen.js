import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../styles/appStyles';

export const ListsScreen = ({
  lists,
  listName,
  onChangeListName,
  onAddList,
  onDeleteList,
  onOpenList,
  onLogout,
  isSubmitting,
  isLoadingLists,
  listError,
}) => (
  <View style={styles.listContainer}>
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Your Grocery Lists</Text>
    </View>

    <View style={styles.addRow}>
      <TextInput
        style={styles.listInput}
        placeholder="New list name..."
        placeholderTextColor="#9ca3af"
        value={listName}
        onChangeText={onChangeListName}
      />
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={onAddList}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </View>

    {listError ? <Text style={styles.error}>{listError}</Text> : null}

    {isLoadingLists ? (
      <View style={styles.loadingRow}>
        <ActivityIndicator />
      </View>
    ) : (
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.listItem,
              pressed && styles.listItemPressed,
            ]}
            onPress={() => onOpenList(item)}
          >
            <Text style={styles.listName}>{item.name}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
              onPress={() => onDeleteList(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </Pressable>
        )}
      />
    )}
  </View>
);
