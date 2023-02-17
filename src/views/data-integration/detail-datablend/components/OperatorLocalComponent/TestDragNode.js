import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType
} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOperatorPipelineLocal,
  increaseCountOpe,
  resetOperatorDetalLocal,
  updateSelectOpe
} from '~/redux/slices/project';
import CustomNode from '../CustomNode/CustomNode';
import FtelSqlNode from '../CustomNode/SQLNode';
import dagre from 'dagre';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './style.scss';

const nodeTypes = {
  customNode: CustomNode,
  ftelsqlNode: FtelSqlNode
};

const nodeWidth = 150;
const nodeHeight = 10;

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

const DetailTopPipelineComponent = () => {
  const classes = useStyles();
  //store
  const dispatch = useDispatch();
  const {
    diDetail,
    diCreatePipline,
    diOperatorDetail,
    opeSelect,
    countOpe
  } = useSelector(state => state.project);
  //state
  const [initNodes, setInitNodes] = useState();
  const [initEdges, setInitEdges] = useState();
  const [checkDelete, setCheckDelete] = useState('');
  //ref
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  //delete node
  React.useEffect(() => {
    if (checkDelete == diOperatorDetail.id) dispatch(resetOperatorDetalLocal());
    let index = 0;
    diCreatePipline.map((item, i) => {
      if (item?.id == diDetail?.id) index = i;
    });
    let filterObj = diCreatePipline.find(item => {
      return item?.id == diDetail?.id;
    });
    const nameDelete = filterObj.operators.find(item => item.id == checkDelete)
      ?.name;
    let newOperators = filterObj.operators.filter(
      item => item.id != checkDelete
    );
    let newOperatorsFormat = [];
    newOperators.map(ope => {
      if (ope.dependsOn.length == 0) return newOperatorsFormat.push(ope);
      else {
        let cloneDepensOn = [];
        cloneDepensOn = ope.dependsOn.filter(item => item != nameDelete);
        return newOperatorsFormat.push({ ...ope, dependsOn: cloneDepensOn });
      }
    });
    let data = [...diCreatePipline];
    data.splice(index, 1, {
      ...filterObj,
      operators: newOperatorsFormat
    });
    dispatch(addOperatorPipelineLocal(data));
  }, [checkDelete]);

  //ktra edges higlight
  React.useEffect(() => {
    let newEdges = [];
    edges.map(edg => {
      if ((edg.source == opeSelect) | (edg.target == opeSelect)) {
        return newEdges.push({
          ...edg,
          className: 'active'
        });
      } else
        return newEdges.push({
          ...edg,
          className: ''
        });
    });
    setEdges(newEdges);
  }, [opeSelect, setEdges]);

  //Update operator
  React.useEffect(() => {
    let indexPipeline = null;
    diCreatePipline?.map((pipeline, index) => {
      if (pipeline?.id == diDetail?.id) indexPipeline = index;
    });
    let indexNode = null;
    nodes?.map((item, index) => {
      if (item.data.id == diOperatorDetail.id) indexNode = index;
    });
    if (indexNode !== null) {
      let value = null;
      diCreatePipline[indexPipeline]?.operators?.map(ope => {
        if (ope.id == diOperatorDetail.id) value = ope;
      });
      let newNode = nodes[indexNode];
      newNode.data = { ...newNode.data, ...value };
      setNodes(nds =>
        nds.map((node, index) => {
          if (index == indexNode) {
            node.data = {
              ...node.data,
              ...value
            };
          }
          return node;
        })
      );
    }
  }, [diCreatePipline, setNodes]);

  //filter operator when change diDetail
  React.useEffect(() => {
    if (diDetail.typeLocal == 'new') {
      let newNodes = [];
      diDetail?.operators?.map((ope, index) => {
        if (ope?.type == 'customNode')
          return newNodes.push({
            id: `${index}`,
            type: ope?.type,
            position: { x: 0, y: 0 },
            data: {
              label: ope?.label,
              name: ope?.name,
              onDelete: id => handleDeleteNode(id),
              id: ope?.id,
              retries: ope?.retries,
              dependsOn: ope?.dependsOn,
              source: ope?.source,
              sink: ope?.sink,
              mapping: ope?.mapping
            }
          });
        else
          return newNodes.push({
            id: `${index}`,
            type: ope?.type,
            position: { x: 0, y: 0 },
            data: {
              label: ope?.label,
              name: ope?.name,
              onDelete: id => handleDeleteNode(id),
              id: ope?.id,
              retries: ope?.retries,
              dependsOn: ope?.dependsOn,
              scriptConnection: ope?.scriptConnection,
              scriptPath: ope?.scriptPath,
              serviceConnection: ope?.serviceConnection
            }
          });
      });
      setNodes(nds => {
        setInitNodes(newNodes);
        return newNodes;
      });
    }
  }, [diDetail, setNodes]);

  React.useEffect(() => {
    if (diDetail.typeLocal == 'new') {
      let newEdges = [];
      diDetail?.operators?.map((ope, index) => {
        const {
          id,
          positionOpe,
          label,
          name,
          retries,
          dependsOn,
          source,
          sink,
          mapping
        } = ope;
        if (dependsOn.length != 0) {
          const idTarget = initNodes?.find(node => node.data.id == ope.id)?.id;
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
    }
  }, [initNodes]);

  React.useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initNodes,
      initEdges
    );

    if (layoutedNodes) {
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
  }, [initNodes, initEdges, setNodes]);

  React.useEffect(() => {
    onLayout('LR');
  }, [diDetail]);

  const onConnect = useCallback(
    params => {
      setEdges(eds =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed
            },
            className:
              params.source == `${opeSelect}`
                ? 'active'
                : params.target == `${opeSelect}`
                ? 'active'
                : ''
          },
          eds
        )
      );
      // Xử lý update
      let name = nodes.find(item => item.id == params.source).data.name;
      let id = nodes.find(item => item.id == params.target).data.id;
      let indexOpe = 0;
      let index = 0;
      diCreatePipline.map((item, i) => {
        if (item?.id == diDetail?.id) index = i;
      });
      let filterObj = diCreatePipline.find(item => {
        return item?.id == diDetail?.id;
      });
      filterObj.operators.map((item, i) => {
        if (item?.id == id) indexOpe = i;
      });
      let arrDepends = filterObj.operators.find(item => item.id == id);
      let cloneDependOn = [...arrDepends.dependsOn, name];
      let cloneOpeChange = {
        ...filterObj.operators[indexOpe],
        dependsOn: cloneDependOn
      };
      let cloneFilterOpe = [...filterObj.operators];
      cloneFilterOpe?.splice(indexOpe, 1, cloneOpeChange);
      let data = [...diCreatePipline];
      data.splice(index, 1, { ...filterObj, operators: cloneFilterOpe });
      dispatch(addOperatorPipelineLocal(data));
    },
    [nodes, diDetail, diCreatePipline, diOperatorDetail]
  );

  const funcOnDisConnect = useCallback(
    value => {
      // Xử lý update
      let name = nodes.find(item => item.id == value[0].source).data.name;
      let id = nodes.find(item => item.id == value[0].target).data.id;
      let indexOpe = 0;
      let index = 0;
      diCreatePipline.map((item, i) => {
        if (item?.id == diDetail?.id) index = i;
      });
      let filterObj = diCreatePipline.find(item => {
        return item?.id == diDetail?.id;
      });
      filterObj.operators.map((item, i) => {
        if (item?.id == id) indexOpe = i;
      });
      let arrDepends = filterObj.operators.find(item => item.id == id);
      let cloneDependOn = arrDepends.dependsOn.filter(ope => ope != name);
      let cloneOpeChange = {
        ...filterObj.operators[indexOpe],
        dependsOn: cloneDependOn
      };
      let cloneFilterOpe = [...filterObj.operators];
      cloneFilterOpe?.splice(indexOpe, 1, cloneOpeChange);
      let data = [...diCreatePipline];
      data.splice(index, 1, { ...filterObj, operators: cloneFilterOpe });
      dispatch(addOperatorPipelineLocal(data));
    },
    [edges, diCreatePipline, diDetail]
  );

  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  //delete node
  const handleDeleteNode = useCallback(
    id => {
      setCheckDelete(id);
      setNodes(nds => nds.filter(item => item.data.id !== id));
    },
    [nodes, diDetail, diCreatePipline, diOperatorDetail]
  );

  const funcDeleteNode = value => {
    setCheckDelete(value[0].data.id);
    let index = 0;
    diCreatePipline.map((item, i) => {
      if (item?.id == diDetail?.id) index = i;
    });
    let filterObj = diCreatePipline.find(item => {
      return item?.id == diDetail?.id;
    });
    let newOperators = filterObj.operators.filter(
      item => item.id != value[0].data.id
    );
    let newOperatorsFormat = [];
    newOperators.map(ope => {
      if (ope.dependsOn.length == 0) return newOperatorsFormat.push(ope);
      else {
        let cloneDepensOn = [];
        cloneDepensOn = ope.dependsOn.filter(
          item => item != value[0].data.name
        );
        return newOperatorsFormat.push({ ...ope, dependsOn: cloneDepensOn });
      }
    });
    let data = [...diCreatePipline];
    data.splice(index, 1, {
      ...filterObj,
      operators: newOperatorsFormat
    });
    dispatch(addOperatorPipelineLocal(data));
  };

  const onDrop = useCallback(
    event => {
      dispatch(increaseCountOpe());
      if (diDetail.typeLocal == 'new') {
        event.preventDefault();
        let numberRandom = Math.random();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        let filterObj = diCreatePipline?.find(item => {
          return item?.id == diDetail?.id;
        });

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        });
        let newNode = {};
        if (type == 'copyData') {
          newNode = {
            id: `${Math.random()}`,
            type: 'customNode',
            position,
            data: {
              label: `Coppy Operator ${countOpe}`,
              name: `Coppy Operator ${countOpe}`,
              onDelete: id => handleDeleteNode(id),
              id: numberRandom,
              retries: 0,
              dependsOn: [],
              source: { datasetId: '' },
              sink: { datasetId: '', saveMode: 'Append' },
              mapping: [],
              type: 'customNode'
            }
          };
        } else {
          newNode = {
            id: `${Math.random()}`,
            type: 'ftelsqlNode',
            position,
            data: {
              label: `Ftel SQL Operator ${countOpe}`,
              name: `Ftel SQL Operator ${countOpe}`,
              onDelete: id => handleDeleteNode(id),
              id: numberRandom,
              retries: 0,
              dependsOn: [],
              serviceConnection: '',
              scriptConnection: '',
              scriptPath: '',
              type: 'ftelsqlNode'
            }
          };
        }

        setNodes(nds => nds.concat(newNode));
        // xu ly store
        let index = 0;
        diCreatePipline.map((item, i) => {
          if (item?.id == diDetail?.id) index = i;
        });

        let newOperator = {};

        if (type == 'copyData') {
          newOperator = {
            id: numberRandom,
            label: `Coppy Operator ${countOpe}`,
            name: `Coppy Operator ${countOpe}`,
            retries: 0,
            dependsOn: [],
            source: { datasetId: '' },
            sink: { datasetId: '', saveMode: 'Append' },
            mapping: [],
            type: 'customNode',
            position
          };
        } else {
          newOperator = {
            id: numberRandom,
            label: `Ftel SQL Operator ${countOpe}`,
            name: `Ftel SQL Operator ${countOpe}`,
            retries: 0,
            dependsOn: [],
            serviceConnection: '',
            scriptConnection: '',
            scriptPath: '',
            type: 'ftelsqlNode',
            position
          };
        }

        let newOperators = [...filterObj.operators, newOperator];
        let data = [...diCreatePipline];
        data.splice(index, 1, {
          ...filterObj,
          operators: newOperators
        });

        dispatch(addOperatorPipelineLocal(data));
      }
    },
    [reactFlowInstance, diDetail, diCreatePipline]
  );

  const onLayout = useCallback(
    direction => {
      const {
        nodes: layoutedNodes,
        edges: layoutedEdges
      } = getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [initNodes, initEdges, setNodes, nodes, edges]
  );

  return (
    <>
      <ReactFlowProvider>
        <ReactFlow
          className={classes.classHiddenLogo}
          ref={reactFlowWrapper}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setReactFlowInstance}
          onConnect={onConnect}
          onEdgesDelete={value => funcOnDisConnect(value)}
          onNodesDelete={value => funcDeleteNode(value)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          nodeTypes={nodeTypes}
          onClick={e => {
            if (
              e.target.className == 'react-flow__pane react-flow__container'
            ) {
              dispatch(updateSelectOpe(''));
            }
          }}
        >
          <Controls />
          <div className="controls">
            <Button variant="outlined" onClick={() => onLayout('LR')}>
              Sort node
            </Button>
          </div>
        </ReactFlow>
      </ReactFlowProvider>
    </>
  );
};

export default React.memo(DetailTopPipelineComponent);
