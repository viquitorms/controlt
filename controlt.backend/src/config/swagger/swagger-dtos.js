export const dtoSchemas = {
  "Login": {
    "email": "exemplo",
    "password": "exemplo"
  },
  "CreateItem": {
    "title": "exemplo",
    "note": "exemplo",
    "created_by_id": 1
  },
  "FilterItem": {
    "title": "exemplo",
    "created_by_id": 1,
    "created_date_from": "exemplo",
    "created_date_to": "exemplo",
    "page": 1,
    "limit": 1
  },
  "UpdateItem": {
    "title": "exemplo",
    "note": "exemplo"
  },
  "CreatePriorityTask": {
    "level": 1,
    "name": "exemplo"
  },
  "CreateProject": {
    "title": "exemplo",
    "description": "exemplo",
    "status_id": 1
  },
  "FilterProject": {
    "title": "exemplo",
    "status_id": 1,
    "page": 1,
    "limit": 1
  },
  "UpdateProject": {
    "title": "exemplo",
    "description": "exemplo",
    "status_id": 1
  },
  "FilterRecordedTime": {
    "user_id": 1,
    "item_id": 1,
    "task_id": 1,
    "date_from": "exemplo",
    "date_to": "exemplo",
    "page": 1,
    "limit": 1
  },
  "StartTimer": {
    "item_id": 1,
    "task_id": 1
  },
  "CreateStatusProject": {
    "name": "exemplo"
  },
  "CreateStatusTask": {
    "name": "exemplo"
  },
  "CreateTask": {
    "item_id": 1,
    "title": "exemplo",
    "description": "exemplo",
    "due_date": "exemplo",
    "priority_id": 1,
    "project_id": 1,
    "status_id": 1,
    "created_by_id": 1,
    "assigned_to_id": 1
  },
  "FilterTask": {
    "status_id": 1,
    "priority_id": 1,
    "project_id": 1,
    "assigned_to_id": 1,
    "due_date_from": "exemplo",
    "due_date_to": "exemplo",
    "page": 1,
    "limit": 1
  },
  "UpdateTask": {
    "title": "exemplo",
    "description": "exemplo",
    "due_date": "exemplo",
    "priority_id": 1,
    "project_id": 1,
    "status_id": 1,
    "assigned_to_id": 1
  },
  "CreateUser": {
    "name": "exemplo",
    "email": "exemplo",
    "password": "exemplo",
    "profile_id": 1
  },
  "UpdateUser": {
    "name": "exemplo",
    "email": "exemplo",
    "password": "exemplo",
    "profile_id": 1
  }
};
