import React from 'react';

import {type FC, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

import {TreeNode} from '.';

interface INodeViewProps {
  node: TreeNode;
  renderTreeNode: (node: TreeNode, index: number, depth: number) => any;
  depth: number;
}

const NodeView: FC<INodeViewProps> = ({node, renderTreeNode, depth = 0}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(node.isExpanded);
  return (
    <View style={styles.nodeContainer}>
      <Pressable
        onPress={() => {
          setIsExpanded(!isExpanded);
        }}
        style={styles.pressable}>
        <Text style={styles.nodeName}>{node.type}</Text>
        {node.children.length === 0 && (
          <Text style={styles.badge}>Leaf Node</Text>
        )}
      </Pressable>
      {isExpanded &&
        node.children.map((childNode: any, childIndex: any) =>
          renderTreeNode(childNode, childIndex, depth + 1),
        )}
    </View>
  );
};

export default NodeView;

const styles = StyleSheet.create({
  nodeContainer: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  nodeName: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  badge: {
    backgroundColor: 'black',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginRight: 5,
    fontSize: 10,
  },
  pressable: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
