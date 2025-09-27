import React, { useState, useEffect } from 'react';
import { X, Users, Building, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import performanceService from '../../services/api/performanceService';

const PerformanceTargetAssignModal = ({ isOpen, onClose, onSuccess, target = null }) => {
  const [formData, setFormData] = useState({
    targetId: null,
    departmentAssignments: [],
    userAssignments: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [departmentWeights, setDepartmentWeights] = useState({});
  const [userWeights, setUserWeights] = useState({});

  useEffect(() => {
    if (isOpen && target) {
      setFormData(prev => ({
        ...prev,
        targetId: target.targetId
      }));
      loadData();
    }
  }, [isOpen, target]);

  const loadData = async () => {
    try {
      const [deptResponse, userResponse] = await Promise.all([
        performanceService.getAvailableDepartments(),
        performanceService.getAvailableUsers()
      ]);
      setDepartments(deptResponse.data);
      setUsers(userResponse.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const addDepartmentAssignment = () => {
    setFormData(prev => ({
      ...prev,
      departmentAssignments: [...prev.departmentAssignments, {
        departmentId: null,
        targetValue: target?.targetValue || 0,
        weight: 0,
        currentTotalWeight: 0
      }]
    }));
  };

  const updateDepartmentAssignment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      departmentAssignments: prev.departmentAssignments.map((assignment, i) => 
        i === index ? { ...assignment, [field]: value } : assignment
      )
    }));
  };

  const removeDepartmentAssignment = (index) => {
    setFormData(prev => ({
      ...prev,
      departmentAssignments: prev.departmentAssignments.filter((_, i) => i !== index)
    }));
  };

  const addUserAssignment = () => {
    setFormData(prev => ({
      ...prev,
      userAssignments: [...prev.userAssignments, {
        userId: null,
        targetValue: target?.targetValue || 0,
        weight: 0,
        currentTotalWeight: 0
      }]
    }));
  };

  const updateUserAssignment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      userAssignments: prev.userAssignments.map((assignment, i) => 
        i === index ? { ...assignment, [field]: value } : assignment
      )
    }));
  };

  const removeUserAssignment = (index) => {
    setFormData(prev => ({
      ...prev,
      userAssignments: prev.userAssignments.filter((_, i) => i !== index)
    }));
  };

  const loadDepartmentWeight = async (departmentId) => {
    if (!departmentId) return;
    try {
      const response = await performanceService.getTotalWeight({ departmentId });
      setDepartmentWeights(prev => ({
        ...prev,
        [departmentId]: response.data
      }));
    } catch (error) {
      console.error('Departman ağırlığı yüklenirken hata:', error);
    }
  };

  const loadUserWeight = async (userId) => {
    if (!userId) return;
    try {
      const response = await performanceService.getTotalWeight({ userId });
      setUserWeights(prev => ({
        ...prev,
        [userId]: response.data
      }));
    } catch (error) {
      console.error('Kullanıcı ağırlığı yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      await performanceService.assignPerformanceTarget(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Hedef ataması yapılırken hata:', error);
      setErrors([error.response?.data?.message || 'Bir hata oluştu.']);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !target) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>
            <Users className="icon" />
            Hedef Ataması: {target.targetName}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {errors.length > 0 && (
            <div className="error-message">
              <AlertCircle size={20} />
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="target-info">
            <h4>Hedef Bilgileri</h4>
            <div className="target-details">
              <div className="target-detail">
                <strong>Hedef Değeri:</strong> {target.targetValue} {target.unit}
              </div>
              <div className="target-detail">
                <strong>Ağırlık:</strong> {target.weight}%
              </div>
              <div className="target-detail">
                <strong>Yön:</strong> {target.direction === 1 ? 'Pozitif' : 'Negatif'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="performance-assign-form">
            {/* Departman Atamaları */}
            <div className="form-section">
              <h3>
                <Building className="icon" />
                Departman Atamaları
              </h3>
              
              {formData.departmentAssignments.map((assignment, index) => (
                <div key={index} className="assignment-item">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Departman</label>
                      <select
                        value={assignment.departmentId || ''}
                        onChange={(e) => {
                          const departmentId = e.target.value ? parseInt(e.target.value) : null;
                          updateDepartmentAssignment(index, 'departmentId', departmentId);
                          if (departmentId) {
                            loadDepartmentWeight(departmentId);
                          }
                        }}
                        className="form-input"
                      >
                        <option value="">Departman Seçin</option>
                        {departments.map(dept => (
                          <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.departmentName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hedef Değeri</label>
                      <input
                        type="number"
                        value={assignment.targetValue}
                        onChange={(e) => updateDepartmentAssignment(index, 'targetValue', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ağırlık (%)</label>
                      <input
                        type="number"
                        value={assignment.weight}
                        onChange={(e) => updateDepartmentAssignment(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                      {assignment.departmentId && departmentWeights[assignment.departmentId] !== undefined && (
                        <small className="form-help">
                          Mevcut toplam ağırlık: {departmentWeights[assignment.departmentId]}%
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <button
                        type="button"
                        onClick={() => removeDepartmentAssignment(index)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={16} />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addDepartmentAssignment}
                className="btn btn-secondary"
              >
                <Plus size={16} />
                Departman Ekle
              </button>
            </div>

            {/* Kullanıcı Atamaları */}
            <div className="form-section">
              <h3>
                <Users className="icon" />
                Kullanıcı Atamaları
              </h3>
              
              {formData.userAssignments.map((assignment, index) => (
                <div key={index} className="assignment-item">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Kullanıcı</label>
                      <select
                        value={assignment.userId || ''}
                        onChange={(e) => {
                          const userId = e.target.value ? parseInt(e.target.value) : null;
                          updateUserAssignment(index, 'userId', userId);
                          if (userId) {
                            loadUserWeight(userId);
                          }
                        }}
                        className="form-input"
                      >
                        <option value="">Kullanıcı Seçin</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hedef Değeri</label>
                      <input
                        type="number"
                        value={assignment.targetValue}
                        onChange={(e) => updateUserAssignment(index, 'targetValue', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ağırlık (%)</label>
                      <input
                        type="number"
                        value={assignment.weight}
                        onChange={(e) => updateUserAssignment(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="form-input"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                      {assignment.userId && userWeights[assignment.userId] !== undefined && (
                        <small className="form-help">
                          Mevcut toplam ağırlık: {userWeights[assignment.userId]}%
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <button
                        type="button"
                        onClick={() => removeUserAssignment(index)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={16} />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addUserAssignment}
                className="btn btn-secondary"
              >
                <Plus size={16} />
                Kullanıcı Ekle
              </button>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner small" />
                    Atanıyor...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Ata
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTargetAssignModal;