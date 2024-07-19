class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        if (this.root === null) {
            this.root = new TreeNode(value);
        } else {
            if (this.isDuplicate(this.root, value)) {
                alert("You are entering a duplicate element");
            } else {
                this.insertNode(this.root, new TreeNode(value));
            }
        }
    }

    isDuplicate(node, value) {
        if (node === null) {
            return false;
        }
        if (node.value === value) {
            return true;
        } else if (value < node.value) {
            return this.isDuplicate(node.left, value);
        } else {
            return this.isDuplicate(node.right, value);
        }
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    delete(value) {
        this.root = this.deleteNode(this.root, value);
    }

    deleteNode(node, value) {
        if (node === null) {
            return null;
        }
        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
            return node;
        } else {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }
            const aux = this.findMinNode(node.right);
            node.value = aux.value;
            node.right = this.deleteNode(node.right, aux.value);
            return node;
        }
    }

    findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    search(value) {
        return this.searchNode(this.root, value);
    }

    searchNode(node, value) {
        if (node === null) {
            return null;
        }
        if (value < node.value) {
            return this.searchNode(node.left, value);
        } else if (value > node.value) {
            return this.searchNode(node.right, value);
        } else {
            return node;
        }
    }

    preorderTraversal() {
        const nodes = [];
        const traverse = (node) => {
            if (node) {
                nodes.push(node);
                traverse(node.left);
                traverse(node.right);
            }
        };
        traverse(this.root);
        return nodes;
    }

    inorderTraversal() {
        const nodes = [];
        const traverse = (node) => {
            if (node) {
                traverse(node.left);
                nodes.push(node);
                traverse(node.right);
            }
        };
        traverse(this.root);
        return nodes;
    }

    postorderTraversal() {
        const nodes = [];
        const traverse = (node) => {
            if (node) {
                traverse(node.left);
                traverse(node.right);
                nodes.push(node);
            }
        };
        traverse(this.root);
        return nodes;
    }
}

const tree = new BST();

function insertNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        tree.insert(value);
        visualizeTree(tree.root);
    }
}

function deleteNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        tree.delete(value);
        visualizeTree(tree.root);
    }
}

function searchNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        const node = tree.search(value);
        if (node) {
            visualizeTree(tree.root, node);
        } else {
            alert("Node not found");
        }
    }
}

function preorderTraversal() {
    const nodes = tree.preorderTraversal();
    highlightTraversal(nodes);
}

function inorderTraversal() {
    const nodes = tree.inorderTraversal();
    highlightTraversal(nodes);
}

function postorderTraversal() {
    const nodes = tree.postorderTraversal();
    highlightTraversal(nodes);
}

function highlightTraversal(nodes) {
    const resultDiv = document.getElementById('traversal-result');
    const resultContainer = document.getElementById('traversal-result-container');
    resultDiv.innerHTML = '';
    resultContainer.style.display = 'flex';
    let i = 0;

    function highlightNext() {
        if (i < nodes.length) {
            visualizeTree(tree.root, nodes[i]);
            const nodeGroup = d3.select(resultDiv).append('g')
                .attr('transform', `translate(${i * 60 + 30}, 30)`);

            nodeGroup.append('circle')
                .attr('r', 20)
                .attr('cx', 0)
                .attr('cy', 0)
                .style('fill', 'lightgreen')
                .style('stroke', 'steelblue')
                .style('stroke-width', '2px');

            nodeGroup.append('text')
                .attr('dy', 3)
                .attr('y', 0)
                .attr('x', 0)
                .style('text-anchor', 'middle')
                .text(nodes[i].value);

            i++;
            setTimeout(highlightNext, 2000);
        } else {
            visualizeTree(tree.root);
            setTimeout(() => {
                resultContainer.style.display = 'none';
            }, 3000);
        }
    }
    highlightNext();
}

function visualizeTree(root, highlightNode = null) {
    const svg = d3.select("#tree-visualization").html("").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(40,40)");

    const treeLayout = d3.tree().size([880, 400]);

    const rootD3 = d3.hierarchy(root, d => {
        return d ? [d.left, d.right].filter(n => n !== null) : [];
    });

    treeLayout(rootD3);

    const link = svg.selectAll(".link")
        .data(rootD3.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d => {
            return "M" + d.x + "," + d.y
                + "C" + d.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + d.parent.y;
        });

    const node = svg.selectAll(".node")
        .data(rootD3.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
        .attr("r", 20)
        .style("fill", d => d.data === highlightNode ? "lightgreen" : "lightblue")
        .style("stroke", "steelblue")
        .style("stroke-width", "2px");

    node.append("text")
        .attr("dy", 3)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text(d => d.data.value);
}
