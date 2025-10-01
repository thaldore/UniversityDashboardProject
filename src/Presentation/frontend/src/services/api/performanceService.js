import apiClient from './apiClient';

const performanceService = {
  // Performance Period Methods
  async getPerformancePeriods() {
    return await apiClient.get('/performance/periods');
  },

  async getPerformancePeriod(id) {
    return await apiClient.get(`/performance/periods/${id}`);
  },

  async createPerformancePeriod(data) {
    return await apiClient.post('/performance/periods', data);
  },

  async updatePerformancePeriod(id, data) {
    return await apiClient.put(`/performance/periods/${id}`, data);
  },

  async deletePerformancePeriod(id) {
    return await apiClient.delete(`/performance/periods/${id}`);
  },

  async togglePerformancePeriodStatus(id, isActive) {
    return await apiClient.patch(`/performance/periods/${id}/status`, isActive);
  },

  // Performance Target Methods
  async getPerformanceTargets(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.periodId) queryParams.append('periodId', params.periodId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.departmentId) queryParams.append('departmentId', params.departmentId);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/performance/targets?${queryString}` : '/performance/targets';
    return await apiClient.get(url);
  },

  async getPerformanceTarget(id) {
    return await apiClient.get(`/performance/targets/${id}`);
  },

  async createPerformanceTarget(data) {
    return await apiClient.post('/performance/targets', data);
  },

  async updatePerformanceTarget(id, data) {
    return await apiClient.put(`/performance/targets/${id}`, data);
  },

  async deletePerformanceTarget(id) {
    return await apiClient.delete(`/performance/targets/${id}`);
  },

  async assignPerformanceTarget(data) {
    return await apiClient.post('/performance/targets/assign', data);
  },

  async submitPerformanceTarget(id) {
    return await apiClient.post(`/performance/targets/${id}/submit`);
  },

  async approveRejectPerformanceTarget(id, data) {
    return await apiClient.post(`/performance/targets/${id}/approve-reject`, data);
  },

  // Performance Target Progress Methods
  async getPerformanceTargetProgresses(targetId) {
    return await apiClient.get(`/performance/targets/${targetId}/progresses`);
  },

  async getPerformanceTargetProgress(id) {
    return await apiClient.get(`/performance/progresses/${id}`);
  },

  async createPerformanceTargetProgress(data) {
    return await apiClient.post('/performance/progresses', data);
  },

  async updatePerformanceTargetProgress(id, data) {
    return await apiClient.put(`/performance/progresses/${id}`, data);
  },

  async deletePerformanceTargetProgress(id) {
    return await apiClient.delete(`/performance/progresses/${id}`);
  },

  async submitPerformanceTargetProgress(id) {
    return await apiClient.post(`/performance/progresses/${id}/submit`);
  },

  async approveRejectPerformanceTargetProgress(id, data) {
    return await apiClient.post(`/performance/progresses/${id}/approve-reject`, data);
  },

  // Performance Scoring Methods
  async getPerformanceScorings(periodId) {
    return await apiClient.get(`/performance/periods/${periodId}/scorings`);
  },

  async createPerformanceScoring(periodId, data) {
    return await apiClient.post(`/performance/periods/${periodId}/scorings`, data);
  },

  async updatePerformanceScoring(id, data) {
    return await apiClient.put(`/performance/scorings/${id}`, data);
  },

  async deletePerformanceScoring(id) {
    return await apiClient.delete(`/performance/scorings/${id}`);
  },

  // Performance Assignment Methods
  async getPerformanceAssignments(periodId) {
    return await apiClient.get(`/performance/periods/${periodId}/assignments`);
  },

  async createPerformanceAssignment(periodId, data) {
    return await apiClient.post(`/performance/periods/${periodId}/assignments`, data);
  },

  async deletePerformanceAssignment(id) {
    return await apiClient.delete(`/performance/assignments/${id}`);
  },

  // Performance Contribution Methods
  async getPerformanceContributions(targetId) {
    return await apiClient.get(`/performance/targets/${targetId}/contributions`);
  },

  // Utility Methods
  async getAvailableDepartments() {
    return await apiClient.get('/performance/departments');
  },

  async getAvailableUsers() {
    return await apiClient.get('/performance/users');
  },

  async getUsersByDepartment(departmentId) {
    return await apiClient.get(`/performance/users/department/${departmentId}`);
  },

  async calculateTargetScore(targetId, actualValue) {
    return await apiClient.get(`/performance/targets/${targetId}/score?actualValue=${actualValue}`);
  },

  async getTotalWeight(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.periodId) queryParams.append('periodId', params.periodId);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/performance/weight/total?${queryString}` : '/performance/weight/total';
    return await apiClient.get(url);
  },

  async getUserAuthorizedDepartments(userId, periodId) {
    return await apiClient.get(`/performance/user/${userId}/authorized-departments?periodId=${periodId}`);
  },

  async canUserCreateDepartmentTarget(userId, periodId, departmentId) {
    return await apiClient.get(`/performance/user/${userId}/can-create-department-target?periodId=${periodId}&departmentId=${departmentId}`);
  },

  async canUserEditDepartmentTarget(userId, targetId) {
    return await apiClient.get(`/performance/user/${userId}/can-edit-department-target?targetId=${targetId}`);
  },

  async canUserSubmitDepartmentTarget(userId, targetId) {
    return await apiClient.get(`/performance/user/${userId}/can-submit-department-target?targetId=${targetId}`);
  },

  async canUserAddProgressToDepartmentTarget(userId, targetId) {
    return await apiClient.get(`/performance/user/${userId}/can-add-progress-to-department-target?targetId=${targetId}`);
  }
};

export default performanceService;