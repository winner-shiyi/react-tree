import React, { Component } from 'react';
import {
  SortableTreeWithoutDndContext as SortableTree,
  toggleExpandedForAll,
} from '../../src/index';
import { addNodeUnderParent, removeNodeAtPath } from '../../src/utils/tree-data-utils';

import styles from './stylesheets/app.scss';
import '../shared/favicon/apple-touch-icon.png';
import '../shared/favicon/favicon-16x16.png';
import '../shared/favicon/favicon-32x32.png';
import '../shared/favicon/favicon.ico';
import '../shared/favicon/safari-pinned-tab.svg';

const maxDepth = 10;

/**
 * 添加节点
 */
function addNode(_this, path, getNodeKey) {
  _this.setState(state => ({
    treeData: addNodeUnderParent({
      treeData: state.treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: `qqq`,
      },
    }).treeData,
  }))
}

class App extends Component {
  constructor(props) {
    super(props);



    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        {
          title: 'ddddd',
          children: [
            {
              title: 'ssss',
            },
          ],
        },
      ],
      currentNode:{},
      currpentPath:[]

    };

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }



  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }
  addNode(path, node) {
    this.setState(state => ({
      treeData: addNodeUnderParent({
        treeData: state.treeData,
        parentKey: state.currpentPath[state.currpentPath.length - 1],
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: {
          title: `111`,
        },
      }).treeData,
    }))
  }


  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      // const objectString = Object.keys(node)
      //   .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
      //   .join(',\n   ');

      // global.alert(
      //   'Info passed to the button generator:\n\n' +
      //   `node: {\n   ${objectString}\n},\n` +
      //   `path: [${path.join(', ')}],\n` +
      //   `treeIndex: ${treeIndex}`
      // );
      console.log('node---', node)
      this.setState({
        currentNode: node,
        currpentPath: path
      }, () => {
        console.log('this.state---', this.state);
      });
      
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0,
      });

    const isVirtualized = true;
    const treeContainerStyle = isVirtualized ? { height: 450 } : {};

    // const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <div>
        <section className={styles['main-content']}>
          <h3>Demo</h3>
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })
                }
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
          <div style={treeContainerStyle}>
            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              isVirtualized={isVirtualized}
              maxDepth={maxDepth}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              canDrag={false}
              searchFinishCallback={matches =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
                })
              }
              generateNodeProps={(rowInfo) => {
                return {
                  title: (
                    <div onClick={() => alertNodeInfo(rowInfo)}>
                      {rowInfo.node.title}
                    </div>
                  ),
                };
              }}
            />
          </div>
          <div>
            <button>详情button</button>
            <button onClick={() => this.addNode()}>新增子okr</button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
