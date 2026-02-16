import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import SideBar from "./sideBar";
import { useDispatch, useSelector } from "react-redux";
import {
  getCanbanTasks,
  updateCanbanTask,
} from "../../redux/canban/canbanThunk";

function CanBanBoard() {
  const dispatch = useDispatch();
  const columnsFromRedux = useSelector((state) => state.task.tasks);
  const projects = useSelector((state) => state.task.projects);

  const [columns, setColumns] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [cardData, setCardData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const statusKeyMap = {
    requested: "Requested",
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  useEffect(() => {
    dispatch(getCanbanTasks());
  }, [dispatch]);

  // SYNC REDUX → LOCAL STATE
  useEffect(() => {
    if (!columnsFromRedux) return;

    setColumns((prev) => {
      if (Object.keys(prev).length === 0) {
        return columnsFromRedux;
      }

      const merged = { ...prev };
      Object.keys(columnsFromRedux).forEach((key) => {
        if (!merged[key]?.items?.length) {
          merged[key] = columnsFromRedux[key];
        }
      });

      return merged;
    });
  }, [columnsFromRedux]);

  // SIDEBAR HANDLER
  const handleSidebar = (item) => {
    setCardData(item);
    setShowSidebar(true);
  };

  // DRAG END HANDLER
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    console.log("sourceColumn", sourceColumn);
    const destColumn = columns[destination.droppableId];
    console.log("destColumn", destColumn);

    const sourceItems = [...sourceColumn.items];
    console.log("sourceItems", sourceItems);

    const destItems =
      source.droppableId === destination.droppableId
        ? sourceItems
        : [...destColumn.items];

    console.log("destItems", destItems);

    const [removed] = sourceItems.splice(source.index, 1);
    console.log("removed", removed);

    const updatedTask = {
      ...removed,
      status: destination.droppableId,
    };
    console.log("updatedTask", updatedTask);

    destItems.splice(destination.index, 0, updatedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    });


    dispatch(
      updateCanbanTask({
        id: updatedTask.id,
        status: updatedTask.status,
      }),
    );
  };

  // FILTER TASKS BY PROJECT
  const filterByProject = (items) => {
    if (!selectedProjectId) return items;
    return items.filter((task) => task.project?.id === selectedProjectId);
  };

  return (
    <div className="antialiased w-full relative">
      {/* PROJECT SELECT */}
      <div className="px-4 py-2">
        <select
          className="border px-3 py-2 rounded"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* KANBAN BOARD */}
      <div
        className="py-4 gap-2 px-2 flex justify-center h-full"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => {
            const filteredItems = filterByProject(column.items || []);

            return (
              <div
                key={columnId}
                className="w-1/4 flex flex-col items-center"
              >
                <h1 className="font-bold mb-2">{statusKeyMap[columnId]}</h1>

                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="rounded-lg bg-white/10 p-4 w-full"
                    >
                      {filteredItems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleSidebar(item)}
                              className="mb-3 cursor-pointer"
                              style={provided.draggableProps.style}
                            >
                              <div className="p-4 bg-white shadow rounded">
                                <h2 className="font-semibold">{item.title}</h2>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                                <p className="text-xs mt-1">
                                  Project: {item.project?.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      {/* Sidebar for task details */}
      <SideBar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        cardData={cardData}
      />
    </div>
  );
}

export default CanBanBoard;
