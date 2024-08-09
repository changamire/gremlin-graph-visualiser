$(document).ready(function () {
    nodes = new vis.DataSet();
    edges = new vis.DataSet();

    var container = document.getElementById("network");
    var data = {
        nodes: nodes,
        edges: edges,
    };
    options = {
        width: $("#network").innerWidth() + "px",
        height: $("#network").innerHeight() + "px",
        layout: {
            hierarchical: {
                enabled: true,
                edgeMinimization: true,
            },
            improvedLayout: true,
        },
        nodes: {
            shape: "box",
            margin: 10,
            widthConstraint: {
                maximum: 25,
            },
            scaling: {
                label: true,
            },
            widthConstraint: {
                minimum: 50,
                maximum: 200,
            },
            shapeProperties: {
                interpolation: true,
            },
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    type: "arrow",
                },
            },
            font: {
                size: 8,
            },
        },
    };

    network = new vis.Network(container, data, options);

    network.on("click", function (properties) {
        const ids = properties.nodes;
        const clickedNodes = nodes.get(ids);
        const clickedNodeId = ids[0];
        $("#nodeId").val(clickedNodeId);
        $("#label").val(clickedNodes[0].label);
        getData(clickedNodeId);
    });

    $("#find").click(function () {
        nodes.clear();
        edges.clear();
        getData($("#nodeid").val());
    });
});

function getData(nodeId) {
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/graph/neighbours/${nodeId}`,
        dataType: "json",
        success: function (result, status, xhr) {
            result.vertices.forEach((node) => {
                if (nodes.get("" + node.id) == null) {
                    nodes.add({
                        id: "" + node.id,
                        label: `Id: ${node.id}\n Label: ${node.label}`,
                        title: formatProperties(node.properties),
                    });
                }
            });
            result.edges.forEach((edge) => {
                if (edges.get("" + edge.id) == null) {
                    edges.add({
                        id: edge.id,
                        from: edge.from.id,
                        to: edge.to.id,
                        label: edge.label,
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            alert(
                "Result: " +status + " " + error + " " + xhr.status + " " + xhr.statusText
            );
        },
    });
}

function getCategoryIndex(label) {
    if (label.includes("test")) {
        return 0;
    }
}

function formatProperties(properties) {
    var propertiesString = "";
    if (properties != null) {
        for (const [key, value] of Object.entries(properties)) {
            propertiesString = propertiesString.concat(`${key}: ${value} \n`);
        }
    }
    console.log(propertiesString);
    return propertiesString;
}

function getColor(label) {
    return "#DAE8FC";
}
