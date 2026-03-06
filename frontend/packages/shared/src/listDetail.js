export const sortByPosition = (items) =>
  [...items].sort((a, b) => a.position - b.position);

export const splitByCompleted = (items) => {
  const unchecked = [];
  const checked = [];
  for (const item of items) {
    if (item.completedAt === null || item.completedAt === undefined) {
      unchecked.push(item);
    } else {
      checked.push(item);
    }
  }
  return { unchecked, checked };
};

export const reorderWithin = (list, fromId, toId) => {
  const fromIndex = list.findIndex((item) => item.id === fromId);
  const toIndex = list.findIndex((item) => item.id === toId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return list;
  }
  const updated = [...list];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
};

export const buildOrder = (unchecked, checked) => [...unchecked, ...checked];

export const reorderByDrag = (items, draggingId, targetId) => {
  if (!draggingId || draggingId === targetId) {
    return { nextOrder: items, changed: false };
  }

  const draggingItem = items.find((item) => item.id === draggingId);
  const targetItem = items.find((item) => item.id === targetId);
  if (!draggingItem || !targetItem) {
    return { nextOrder: items, changed: false };
  }

  const draggingCompleted = draggingItem.completedAt !== null && draggingItem.completedAt !== undefined;
  const targetCompleted = targetItem.completedAt !== null && targetItem.completedAt !== undefined;
  if (draggingCompleted !== targetCompleted) {
    return { nextOrder: items, changed: false };
  }

  const { unchecked, checked } = splitByCompleted(items);
  const nextUnchecked = draggingCompleted
    ? unchecked
    : reorderWithin(unchecked, draggingId, targetId);
  const nextChecked = draggingCompleted
    ? reorderWithin(checked, draggingId, targetId)
    : checked;
  const nextOrder = buildOrder(nextUnchecked, nextChecked);

  return { nextOrder, changed: true };
};
