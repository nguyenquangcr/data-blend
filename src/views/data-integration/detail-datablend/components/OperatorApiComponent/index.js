import React, { useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls
} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectOpe } from '~/redux/slices/project';
import dagre from 'dagre';
import LoadingScreen from '~/components/LoadingScreen';
import CustomNodeApi from '../CustomNode/CustomNodeApi';
import { makeStyles } from '@mui/styles';

const nodeTypes = {
  customNode: CustomNodeApi
};

const nodeWidth = 200;
const nodeHeight = 100;

let dagreGraph = null;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'TB';
  dagreGraph.setGraph({ rankdir: direction });

  nodes?.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges?.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes?.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2 + 200,
      y: nodeWithPosition.y - nodeHeight / 2
    };

    return node;
  });
  return { nodes, edges };
};

const useStyles = makeStyles(theme => ({
  classHiddenLogo: {
    '& .react-flow__attribution': {
      display: 'none'
    }
  }
}));

const OperatorApiComponent = () => {
  const classes = useStyles();
  //state
  const [initNodes, setInitNodes] = useState();
  const [initEdges, setInitEdges] = useState();
  const [loading, setLoading] = useState(false);
  //store
  const dispatch = useDispatch();
  const { diDetail } = useSelector(state => state.project);

  //ref
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  //filter operator when change diDetail
  React.useEffect(() => {
    let newNodes = [];
    diDetail?.operators?.map((ope, index) => {
      const { name, policy, dependsOn, properties, type } = ope;
      return newNodes.push({
        id: `${index}`,
        type: 'customNode',
        position: { x: 0, y: 0 },
        data: {
          label: name,
          name,
          onDelete: id => handleDeleteNode(id),
          id: Math.random(),
          policy,
          properties,
          dependsOn,
          type: type == 'FtelSqlOperator' && 'ftelsqlNode'
        }
      });
    });
    setNodes(nds => {
      setInitNodes(newNodes);
      return newNodes;
    });
  }, [diDetail, setNodes]);

  React.useEffect(() => {
    let newEdges = [];
    diDetail?.operators?.map((ope, index) => {
      const { dependsOn } = ope;
      if (dependsOn?.length != 0) {
        const idTarget = initNodes?.find(node => node.data.name == ope.name)
          ?.id;
        dependsOn?.map(dep => {
          const idSource = initNodes?.find(node => node.data.name == dep)?.id;
          newEdges.push({
            id: Math.random(),
            source: `${idSource}`,
            target: `${idTarget}`,
            type: 'smoothstep'
          });
          setEdges(eds =>
            addEdge(
              {
                id: Math.random(),
                source: `${idSource}`,
                target: `${idTarget}`,
                type: 'smoothstep'
              },
              eds
            )
          );
        });
      }
    });
    setInitEdges(newEdges);
  }, [initNodes]);

  React.useEffect(() => {
    setTimeout(() => {
      const {
        nodes: layoutedNodes,
        edges: layoutedEdges
      } = getLayoutedElements(initNodes, initEdges);

      if (layoutedNodes && layoutedEdges) {
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      }
    }, 50);
  }, [initNodes, initEdges, setNodes]);

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [diDetail]);

  return (
    <>
      {loading == true ? (
        <LoadingScreen />
      ) : (
        <ReactFlow
          className={classes.classHiddenLogo}
          ref={reactFlowWrapper}
          nodes={nodes}
          edges={edges}
          onNodeClick={(e, { id }) => dispatch(updateSelectOpe(id))}
          onInit={setReactFlowInstance}
          onClick={e => {
            if (
              e.target.className == 'react-flow__pane react-flow__container'
            ) {
              dispatch(updateSelectOpe(''));
            }
          }}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
        </ReactFlow>
      )}
    </>
  );
};

export default OperatorApiComponent;
