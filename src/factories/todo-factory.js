import angular from 'angular';
import _ from 'lodash';

const todoFactory = angular.module('app.todoFactory', [])

.factory('todoFactory', ($http) => {
	function getTasks($scope) {
		$http.get('/todos').success( response => {
			$scope.todos = response.todos;
		});
	}

	function createTask($scope, params) {
		if (!$scope.createTaskInput) { return; }

		$http.post('/todos', {
			task: $scope.createTaskInput,
			isCompleted: false,
			isEditing: false
		}).success(response => {
			getTasks($scope);
			$scope.createTaskInput = '';
			console.log(response);
		});

		//params.createHasInput = false;
		//$scope.createTaskInput = '';
	}

	function updateTask($scope, todo) {
		$http.put(`/todos/${todo._id}`,  { 
			task: todo.updatedTask 
		}).success(response => {
			getTasks($scope);
			todo.isEditing = false;
			console.log(response);
		});
		// todo.task = todo.updatedTask;
		//todo.isEditing = false;
	}

	function deleteTask($scope, todoToDelete) {
		$http.delete(`/todos/${todoToDelete._id}`
			).success(response => {
				getTasks($scope);
				console.log(response);
			});
		//_.remove($scope.todos, todo => todo.task === todoToDelete.task);

	}

	function watchCreateTaskInput(params, $scope, value) {
		const createHasInput = params.createHasInput;

		if (!value && createHasInput) {
			$scope.todos.pop();
			params.createHasInput = false;
		} else if (value && !createHasInput) {
			$scope.todos.push({ task: value, isCompleted: false});
			params.createHasInput = true;
		} else if (value && createHasInput) {
			$scope.todos[$scope.todos.length-1].task = value;
		}
	}
	
	return {
		getTasks,
		createTask,
		updateTask,
		deleteTask,
		watchCreateTaskInput	
	};
});

export default todoFactory;