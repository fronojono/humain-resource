import { displayAPIWorkingOverlay, hideAPIWorkingOverlay } from '../../modules/ui/actions';
import { dispatch } from '../../store';
import * as cookies from 'tiny-cookie';
import fetch from 'isomorphic-fetch';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
	uri: 'http://localhost:8080/query'
});

export default new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache({
		dataIdFromObject: (object) => null
	})
});
export async function refresh() {
	const oldRefreshToken = cookies.get('refresh_token');
	if (!oldRefreshToken) {
		return false;
	}
	const { accessToken, refreshToken } = await refresh(oldRefreshToken);
	if (accessToken) {
		cookies.set('access_token', accessToken);
		cookies.set('refresh_token', refreshToken);
		return true;
	}
	return false;
}

export function fetchGeneric(url, opts, auth = true) {
	let token;
	if (auth) {
		token = cookies.get('accessToken') || cookies.get('accessToken');
	}
	return fetch(url, {
		...opts,
		headers: {
			...((opts || {}).isFormData ? {} : {}),
			...((opts && opts.headers) || {})
		}
	});
}

export async function fetchJSON(url, opts, auth = true) {
	const res = await fetchGeneric(url, opts, true);

	if (!res.ok) {
		const oldRefreshToken = cookies.get('refresh_token');
		if (res.status === 401 && auth && oldRefreshToken) {
			if (await refresh()) {
				return await fetchJSON(url, opts, true);
			} else {
				const err = new Error('authentication error');
				err.status = res.status;
				throw err;
			}
		} else {
			const err = new Error('network status error');
			err.status = res.status;
			try {
				const json = await res.json();
				if (json) {
					err.body = json;
				}
			} catch (e) {
				// ignore if there is no json body
			}
			throw err;
		}
	}

	let json;
	try {
		json = await res.json();
		if (json.error) {
			const err = new Error('error');
			err.body = json.error;
			throw err;
		}
	} catch (e) {
		// ignore if response is no json.
	}

	return json;
}

export async function ListEmployees() {
	let res = await fetchJSON(`http://localhost:8800/employees/0/0`);
	return res;
}
export async function ListAdminRequest() {
	let res = await fetchJSON(`http://localhost:8800/admin_request/0/0`);
	return res;
}

export async function ListLeaveRequest() {
	let res = await fetchJSON(`http://localhost:8800/leave_request/0/0`);
	return res;
}

export async function isLoggedIn() {
	let res = await fetchJSON(`https://jsonplaceholder.typicode.com/users`);
	return res;
}

export async function posts() {
	let res = await fetchJSON(`https://jsonplaceholder.typicode.com/posts`);
	return res;
}

export function overlayControl(func) {
	return async (...params) => {
		dispatch(displayAPIWorkingOverlay());
		const result = await func(...params);
		dispatch(hideAPIWorkingOverlay());

		return result;
	};
}

export const newPosts = overlayControl(async (title, body) => {
	let res = await fetchJSON(`https://jsonplaceholder.typicode.com/posts`, {
		method: 'POST',
		body: JSON.stringify({
			title: title,
			body: body,
			userId: 1
		})
	});
	return res;
});

export async function listData() {
	let res = await fetchJSON(`https://hn.algolia.com/api/v1/search?query=javascript`);
	return res;
}

export const ApiPost1 = overlayControl(async (title, category, content) => {
	let res = await fetchJSON(`http://127.0.0.1:8000/categories`, {
		method: 'POST',
		body: JSON.stringify({
			name: title,
			description: category,
			content: content
		})
	});
	return res;
});

export async function listDataPost() {
	let res = await fetchJSON(`http://127.0.0.1:8000/categories`);
	return res;
}

export const signup = overlayControl(async (name, email, password) => {
	let res = await fetchJSON(`http://127.0.0.1:8000/users`, {
		method: 'POST',
		body: JSON.stringify({
			name,
			email,
			password
		})
	});
	return res;
});

export const DeleteEmployee = overlayControl(async (id) => {
	let res = await fetchJSON(`http://localhost:8800/employees/${id}`, {
		method: 'DELETE'
	});
	return res;
});
export const DeleteAdminRequest = overlayControl(async (id) => {
	let res = await fetchJSON(`http://localhost:8800/admin_request/${id}`, {
		method: 'DELETE'
	});
	return res;
});
export const DeleteLeaveRequest = overlayControl(async (id) => {
	let res = await fetchJSON(`http://localhost:8800/leave_request/${id}`, {
		method: 'DELETE'
	});
	return res;
});
export const DeleteEvent = overlayControl(async (id) => {
	let res = await fetchJSON(`http://localhost:8800/events/${id}`, {
		method: 'DELETE'
	});
	return res;
});
export async function GetEmployee(id) {
	let res = await fetchJSON(`http://localhost:8800/employees/${id}`);
	return res;
}

export async function CurrentUser(id) {
	let res = await fetchJSON(`http://localhost:8800/employees/${id}`);
	return res;
}

export async function ListDepartment() {
	let res = await fetchJSON(`http://localhost:8800/departments/`);
	return res;
}
export async function ListEmployeeRole() {
	let res = await fetchJSON(`http://localhost:8800/employee_role/`);
	return res;
}
export async function ListContractType() {
	let res = await fetchJSON(`http://localhost:8800/contract_type/`);
	return res;
}
export async function ListManager() {
	let res = await fetchJSON(`http://localhost:8800/get_manager/true`);
	return res;
}
export async function ListAdminRequestType() {
	let res = await fetchJSON(`http://localhost:8800/administration_type/`);
	return res;
}
export async function ListConvention() {
	let res = await fetchJSON(`http://localhost:8800/conventions/0/0`);
	return res;
}
export const AddNewEmployee = overlayControl(async (employee) => {
	let res = await fetchJSON(`http://localhost:8800/employees/`, {
		method: 'POST',
		body: JSON.stringify({
			...employee
		})
	});
	return res;
});
export const AddNewAdminRequest = overlayControl(async (request) => {
	let res = await fetchJSON(`http://localhost:8800/admin_request/`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});

export async function login(user) {
	return await fetchJSON(
		`http://localhost:8800/auth2`,
		{
			method: 'POST',

			body: JSON.stringify({
				...user
			})
		},
		false
	);
}

export const me = async (token) => {
	let res = await fetchJSON(`http://localhost:8800/decode_token/`, {
		method: 'POST',
		body: JSON.stringify({
			token
		})
	});
	return res;
};
export async function uploadFile(url, files, opts) {
	const fileData = new FormData();
	for (let i = 0; i < files.length; i++) {
		fileData.append('file', files[i], i);
	}
	const json = await fetchJSON(url, {
		method: 'POST',
		isFormData: true,
		body: fileData,
		...opts
	});
	return json.body || json;
}
export const newLeave_request = overlayControl(async (obj) => {
	let res = await fetchJSON(`http://localhost:8800/leave_request/`, {
		method: 'POST',
		body: JSON.stringify({
			...obj
		})
	});
	return res;
});

export async function leaveRequestsByManager(name) {
	let res = await fetchJSON(`http://localhost:8800/leave_request_by_manager/${name}`);
	return res;
}

export async function request_type() {
	let res = await fetchJSON(`http://localhost:8800/request_type/`);
	return res;
}

export const EditAdminRequests = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/admin_request/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export const EditEmployee = overlayControl(async (getIdSelected, employee) => {
	let res = await fetchJSON(`http://localhost:8800/employees/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...employee
		})
	});
	return res;
});
export async function ListEvent() {
	let res = await fetchJSON(`http://localhost:8800/events/0/0`);
	return res;
}

export const newEvent = overlayControl(async (obj) => {
	let res = await fetchJSON(`http://localhost:8800/events/`, {
		method: 'POST',
		body: JSON.stringify({
			...obj
		})
	});
	return res;
});
export const newConvention = overlayControl(async (obj) => {
	let res = await fetchJSON(`http://localhost:8800/conventions/`, {
		method: 'POST',
		body: JSON.stringify({
			...obj
		})
	});
	return res;
});

export const DeleteConvention = overlayControl(async (id) => {
	let res = await fetchJSON(`http://localhost:8800/conventions/${id}`, {
		method: 'DELETE'
	});
	return res;
});

export const EditConventions = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/conventions/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export const EditLeaveRequests = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/leave_request/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export const EditEvent = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/events/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export const AcceptLeaveRequests = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/leave_request/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export const RejectLeaveRequests = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/leave_request/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export const AcceptedAdminRequests = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/admin_request/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});

export const RejectAdminRequests = overlayControl(async (getIdSelected, request) => {
	let res = await fetchJSON(`http://localhost:8800/admin_request/${getIdSelected}`, {
		method: 'POST',
		body: JSON.stringify({
			...request
		})
	});
	return res;
});
export async function leaveRequestsById(appliedBy) {
	let res = await fetchJSON(`http://localhost:8800/leave_requests/${appliedBy}`);
	return res;
}
export async function AdminRequestById(appliedBy) {
	let res = await fetchJSON(`http://localhost:8800/admin_requests/${appliedBy} `);
	return res;
}
export async function EmpolyeeByID(id) {
	let res = await fetchJSON(`http://localhost:8800/employees/${id} `);
	return res;
}
