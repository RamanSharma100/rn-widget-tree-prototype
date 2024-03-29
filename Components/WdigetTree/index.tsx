import React, {useState, useEffect} from 'react';

import {
  ScrollView,
  Text,
  View,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

import NodeView from './NodeView';

interface WidgetTreeProps {
  children: React.ReactNode;
}

export interface TreeNode {
  type: string;
  children: TreeNode[];
  isExpanded: boolean;
}

const WidgetTree: React.FC<WidgetTreeProps> = ({children}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeInfo, setTreeInfo] = useState<TreeNode[]>([]);

  useEffect(() => {
    if (children) {
      const info = traverseTree(children);
      setTreeInfo(info);
    }
  }, [children]);

  const traverseTree = (nodes: React.ReactNode): TreeNode[] => {
    const info: TreeNode[] = [];

    React.Children.forEach(nodes, child => {
      if (React.isValidElement(child)) {
        const childType = getChildType(child);
        const childNode: TreeNode = {
          type: childType,
          children: [],
          isOpen: false,
        };

        if (child.props.children) {
          // Recursively traverse child components
          childNode.children = traverseTree(child.props.children);
        }

        info.push(childNode);
      } else if (typeof child === 'function') {
        // Handle functional components
        const childNode: TreeNode = {
          type: child.name || 'FunctionalComponent',
          children: [],
          isExpanded: false,
        };

        info.push(childNode);
      } else {
        // Handle other types of children (such as text nodes)
        const childNode: TreeNode = {
          type: typeof child === 'string' ? 'Text' : 'Unknown',
          children: [],
          isExpanded: false,
        };

        info.push(childNode);
      }
    });

    return info;
  };

  const getChildType = (child: React.ReactElement | any): string => {
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
    return (
      <NodeView
        key={index}
        node={node}
        renderTreeNode={renderTreeNode}
        depth={depth}
      />
    );
  };

  const visualizeTree = () => {
    setModalVisible(true);
    const info = traverseTree(children);
    setTreeInfo(info);
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
          </View>
        </ScrollView>
        <Pressable
          style={[styles.floatingButton]}
          onPress={() => setModalVisible(false)}>
          <Text style={styles.floatingButtonText}>&#x2715;</Text>
        </Pressable>
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
    height: '100%',
    position: 'absolute',
    width: '100%',
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
});

export default WidgetTree;
