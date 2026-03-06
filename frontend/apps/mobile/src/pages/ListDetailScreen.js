import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { splitByCompleted } from '@grocery/shared';
import { styles } from '../styles/appStyles';

export const ListDetailScreen = ({
  list,
  items,
  itemName,
  onChangeItemName,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  itemError,
  isLoadingItems,
  isSubmitting,
}) => {
  const { unchecked: uncheckedItems, checked: checkedItems } =
    splitByCompleted(items);

  return (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle} numberOfLines={1}>
          {list?.name ?? 'Grocery List'}
        </Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.listInput}
          placeholder="New item..."
          placeholderTextColor="#9ca3af"
          value={itemName}
          onChangeText={onChangeItemName}
          onSubmitEditing={onAddItem}
        />
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={onAddItem}
          disabled={isSubmitting}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {itemError ? <Text style={styles.error}>{itemError}</Text> : null}

      {isLoadingItems ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.listContent}>
          <Text style={styles.sectionTitle}>Unchecked</Text>
          <FlatList
            data={uncheckedItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.checkbox,
                    pressed && styles.checkboxPressed,
                  ]}
                  onPress={() => onToggleItem(item.id)}
                >
                  <Text style={styles.checkboxText}></Text>
                </Pressable>
                <Text style={styles.itemText}>{item.name}</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteIcon,
                    pressed && styles.deleteIconPressed,
                  ]}
                  onPress={() => onDeleteItem(item.id)}
                >
                  <Text style={styles.deleteIconText}>×</Text>
                </Pressable>
              </View>
            )}
          />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {checkedItems.length} checked items
            </Text>
          </View>
          <FlatList
            data={checkedItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.checkbox,
                    styles.checkboxChecked,
                    pressed && styles.checkboxPressed,
                  ]}
                  onPress={() => onToggleItem(item.id)}
                >
                  <Text style={styles.checkboxText}>✓</Text>
                </Pressable>
                <Text style={[styles.itemText, styles.itemTextChecked]}>
                  {item.name}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteIcon,
                    pressed && styles.deleteIconPressed,
                  ]}
                  onPress={() => onDeleteItem(item.id)}
                >
                  <Text style={styles.deleteIconText}>×</Text>
                </Pressable>
              </View>
            )}
            contentContainerStyle={styles.checkedContent}
          />
        </View>
      )}
    </View>
  );
};
