import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Modal,
  Button,
  StyleSheet,
  Pressable,
} from 'react-native';

interface WidgetTreeProps {
  children: React.ReactNode;
}

interface TreeNode {
  type: string;
  children: TreeNode[];
}

const WidgetTree: React.FC<WidgetTreeProps> = ({children}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeInfo, setTreeInfo] = useState<TreeNode[]>([]);
  const [clickedNodeIndex, setClickedNodeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (children) {
      const info = traverseTree(children);
      setTreeInfo(info);
    }
  }, [children]);

  const traverseTree = (nodes: React.ReactNode): TreeNode[] => {
    const childrenArray = React.Children.toArray(nodes);
    const info: TreeNode[] = [];

    childrenArray.forEach(child => {
      if (React.isValidElement(child)) {
        const childType = getChildType(child);
        const childNode: TreeNode = {
          type: childType,
          children: traverseTree(child.props.children),
        };
        info.push(childNode);
      }
    });

    return info;
  };

  const getChildType = (child: React.ReactElement): string => {
    if (typeof child.type === 'string') {
      return child.type;
    } else if (child.type.displayName) {
      return child.type.displayName;
    } else if (typeof child.type === 'function') {
      return child.type.name || 'Unknown';
    } else if (typeof child.type === 'object') {
      return child.type.constructor.name || 'Unknown';
    } else {
      return 'Unknown';
    }
  };

  const renderTreeNode = (node: TreeNode, index: number, depth: number) => {
    const handlePress = () => {
      setClickedNodeIndex(index === clickedNodeIndex ? null : index);
    };

    return (
      <View key={index} style={styles.nodeContainer}>
        <Pressable onPress={handlePress}>
          <Text style={styles.nodeName}>{node.type}</Text>
        </Pressable>
        {clickedNodeIndex === index &&
          node.children.map((childNode, childIndex) =>
            renderTreeNode(childNode, childIndex, depth + 1),
          )}
      </View>
    );
  };

  const visualizeTree = () => {
    setModalVisible(true);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Widget Tree</Text>
            {treeInfo.map((node, index) => renderTreeNode(node, index, 0))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </ScrollView>
      </Modal>
      <Pressable style={styles.floatingButton} onPress={visualizeTree}>
        <Text style={styles.floatingButtonText}>🌳</Text>
      </Pressable>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
    zIndex: 100,
    right: 20,
  },
  floatingButtonText: {
    fontSize: 30,
  },
  nodeContainer: {
    marginLeft: 10,
    marginBottom: 5,
  },
  nodeName: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
});

export default WidgetTree;
