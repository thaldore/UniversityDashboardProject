import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Settings, Save, AlertCircle } from 'lucide-react';
import performanceService from '../../services/api/performanceService';
import { validatePerformancePeriod } from '../../services/utils/performanceConstants';

const PerformancePeriodModal = ({ isOpen, onClose, onSuccess, period = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    periodName: '',
    periodStartDate: '',
    periodEndDate: '',
    targetEntryStartDate: '',
    targetEntryEndDate: '',
    targetReviseStartDate: '',
    targetReviseEndDate: '',
    resultEntryStartDate: '',
    resultEntryEndDate: '',
    isActive: true,
    sendNotification: true,
    sendEmail: true,
    scorings: [],
    assignments: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Filtrelenmiş listeler
  const filteredDepartments = departments.filter(dept =>
    dept.departmentName.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (isEdit && period) {
        setFormData({
          periodName: period.periodName || '',
          periodStartDate: period.periodStartDate ? new Date(period.periodStartDate).toISOString().split('T')[0] : '',
          periodEndDate: period.periodEndDate ? new Date(period.periodEndDate).toISOString().split('T')[0] : '',
          targetEntryStartDate: period.targetEntryStartDate ? new Date(period.targetEntryStartDate).toISOString().split('T')[0] : '',
          targetEntryEndDate: period.targetEntryEndDate ? new Date(period.targetEntryEndDate).toISOString().split('T')[0] : '',
          targetReviseStartDate: period.targetReviseStartDate ? new Date(period.targetReviseStartDate).toISOString().split('T')[0] : '',
          targetReviseEndDate: period.targetReviseEndDate ? new Date(period.targetReviseEndDate).toISOString().split('T')[0] : '',
          resultEntryStartDate: period.resultEntryStartDate ? new Date(period.resultEntryStartDate).toISOString().split('T')[0] : '',
          resultEntryEndDate: period.resultEntryEndDate ? new Date(period.resultEntryEndDate).toISOString().split('T')[0] : '',
          isActive: period.isActive ?? true,
          sendNotification: period.sendNotification ?? true,
          sendEmail: period.sendEmail ?? true,
          scorings: period.scorings || [],
          assignments: period.assignments || []
        });
      }
    }
  }, [isOpen, isEdit, period]);

  const loadData = async () => {
    try {
      const [deptResponse, userResponse] = await Promise.all([
        performanceService.getAvailableDepartments(),
        performanceService.getAvailableUsers()
      ]);
      setDepartments(deptResponse.data);
      setUsers(userResponse.data);
      
      // Düzenleme modunda period detaylarını getir
      if (isEdit && period) {
        try {
          const periodDetail = await performanceService.getPerformancePeriodById(period.periodId);
          const periodData = periodDetail.data;
          
          setFormData({
            periodName: periodData.periodName || '',
            periodStartDate: periodData.periodStartDate ? new Date(periodData.periodStartDate).toISOString().split('T')[0] : '',
            periodEndDate: periodData.periodEndDate ? new Date(periodData.periodEndDate).toISOString().split('T')[0] : '',
            targetEntryStartDate: periodData.targetEntryStartDate ? new Date(periodData.targetEntryStartDate).toISOString().split('T')[0] : '',
            targetEntryEndDate: periodData.targetEntryEndDate ? new Date(periodData.targetEntryEndDate).toISOString().split('T')[0] : '',
            targetReviseStartDate: periodData.targetReviseStartDate ? new Date(periodData.targetReviseStartDate).toISOString().split('T')[0] : '',
            targetReviseEndDate: periodData.targetReviseEndDate ? new Date(periodData.targetReviseEndDate).toISOString().split('T')[0] : '',
            resultEntryStartDate: periodData.resultEntryStartDate ? new Date(periodData.resultEntryStartDate).toISOString().split('T')[0] : '',
            resultEntryEndDate: periodData.resultEntryEndDate ? new Date(periodData.resultEntryEndDate).toISOString().split('T')[0] : '',
            isActive: periodData.isActive ?? true,
            sendNotification: periodData.sendNotification ?? true,
            sendEmail: periodData.sendEmail ?? true,
            scorings: periodData.scorings || [],
            assignments: periodData.assignments || []
          });
        } catch (error) {
          console.error('Period detayları yüklenirken hata:', error);
        }
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addScoring = () => {
    setFormData(prev => ({
      ...prev,
      scorings: [...prev.scorings, {
        minValue: 0,
        maxValue: null,
        score: 0,
        letterGrade: '',
        isForNegativeTarget: false,
        displayOrder: prev.scorings.length + 1
      }]
    }));
  };

  const updateScoring = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      scorings: prev.scorings.map((scoring, i) => 
        i === index ? { ...scoring, [field]: value } : scoring
      )
    }));
  };

  const removeScoring = (index) => {
    setFormData(prev => ({
      ...prev,
      scorings: prev.scorings.filter((_, i) => i !== index)
    }));
  };

  const addAssignment = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, {
        assignmentType: 1, // Department
        departmentId: null,
        userId: null,
        targetEntryRole: 'Manager',
        resultEntryRole: 'Manager'
      }]
    }));
  };

  const updateAssignment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map((assignment, i) => 
        i === index ? { ...assignment, [field]: value } : assignment
      )
    }));
  };

  // Yeni atama fonksiyonları
  const handleDepartmentAssignment = (departmentId, isAssigned) => {
    if (isAssigned) {
      // Departman ataması ekle - varsayılan olarak Manager rolü
      setFormData(prev => ({
        ...prev,
        assignments: [...prev.assignments, {
          assignmentType: 1,
          departmentId: departmentId,
          userId: null,
          targetEntryRole: 'Manager',
          resultEntryRole: 'Manager'
        }]
      }));
    } else {
      // Departman atamasını kaldır
      setFormData(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => !(a.assignmentType === 1 && a.departmentId === departmentId))
      }));
    }
  };

  const handleUserAssignment = (userId, isAssigned) => {
    if (isAssigned) {
      // Kullanıcı ataması ekle - kullanıcı kendisi için hedef girişi yapacak
      setFormData(prev => ({
        ...prev,
        assignments: [...prev.assignments, {
          assignmentType: 2,
          departmentId: null,
          userId: userId,
          targetEntryRole: 'User', // Kullanıcı kendisi için hedef girişi yapacak
          resultEntryRole: 'User'
        }]
      }));
    } else {
      // Kullanıcı atamasını kaldır
      setFormData(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => !(a.assignmentType === 2 && a.userId === userId))
      }));
    }
  };

  // Rol yönetimi fonksiyonları
  const getAssignmentTargetEntryRole = (id) => {
    const assignment = formData.assignments.find(a => 
      (a.assignmentType === 1 && a.departmentId === id) || 
      (a.assignmentType === 2 && a.userId === id)
    );
    return assignment?.targetEntryRole || 'Manager';
  };

  const getAssignmentResultEntryRole = (id) => {
    const assignment = formData.assignments.find(a => 
      (a.assignmentType === 1 && a.departmentId === id) || 
      (a.assignmentType === 2 && a.userId === id)
    );
    return assignment?.resultEntryRole || 'Manager';
  };

  const updateDepartmentTargetEntryRole = (departmentId, role) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => 
        a.assignmentType === 1 && a.departmentId === departmentId 
          ? { ...a, targetEntryRole: role }
          : a
      )
    }));
  };

  const updateDepartmentResultEntryRole = (departmentId, role) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => 
        a.assignmentType === 1 && a.departmentId === departmentId 
          ? { ...a, resultEntryRole: role }
          : a
      )
    }));
  };

  // Toplu seçim fonksiyonları
  const handleSelectAllDepartments = (selectAll) => {
    if (selectAll) {
      // Filtrelenmiş departmanları seç
      const newAssignments = filteredDepartments.map(dept => ({
        assignmentType: 1,
        departmentId: dept.departmentId,
        userId: null,
        targetEntryRole: 'Manager',
        resultEntryRole: 'Manager'
      }));
      
      setFormData(prev => ({
        ...prev,
        assignments: [
          ...prev.assignments.filter(a => a.assignmentType !== 1), // Mevcut departman atamalarını kaldır
          ...newAssignments
        ]
      }));
    } else {
      // Tüm departman atamalarını kaldır
      setFormData(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => a.assignmentType !== 1)
      }));
    }
  };

  const handleSelectAllUsers = (selectAll) => {
    if (selectAll) {
      // Filtrelenmiş kullanıcıları seç
      const newAssignments = filteredUsers.map(user => ({
        assignmentType: 2,
        departmentId: null,
        userId: user.id,
        targetEntryRole: 'User',
        resultEntryRole: 'User'
      }));
      
      setFormData(prev => ({
        ...prev,
        assignments: [
          ...prev.assignments.filter(a => a.assignmentType !== 2), // Mevcut kullanıcı atamalarını kaldır
          ...newAssignments
        ]
      }));
    } else {
      // Tüm kullanıcı atamalarını kaldır
      setFormData(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => a.assignmentType !== 2)
      }));
    }
  };

  const removeAssignment = (index) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const validationErrors = validatePerformancePeriod(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      if (isEdit) {
        await performanceService.updatePerformancePeriod(period.periodId, formData);
      } else {
        await performanceService.createPerformancePeriod(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Performans dönemi kaydedilirken hata:', error);
      setErrors([error.response?.data?.message || 'Bir hata oluştu.']);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2>
            <Calendar className="icon" />
            {isEdit ? 'Performans Dönemi Düzenle' : 'Yeni Performans Dönemi'}
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

          <form onSubmit={handleSubmit} className="performance-period-form">
            {/* Temel Bilgiler */}
            <div className="form-section">
              <h3>Temel Bilgiler</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Performans Dönemi Adı</label>
                  <input
                    type="text"
                    name="periodName"
                    value={formData.periodName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Örn: 2024 Yılı Performans Dönemi"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Durum</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      Aktif
                    </label>
                  </div>
                </div>
              </div>
            </div>

             {/* Performans Dönemi Tarihleri */}
             <div className="form-section">
               <h3>Performans Dönemi Tarihleri</h3>
               <div className="form-grid">
                 <div className="form-group">
                   <label className="form-label required">Performans Dönemi Başlangıç</label>
                   <input
                     type="date"
                     name="periodStartDate"
                     value={formData.periodStartDate}
                     onChange={handleInputChange}
                     className="form-input"
                     required
                   />
                 </div>

                 <div className="form-group">
                   <label className="form-label required">Performans Dönemi Bitiş</label>
                   <input
                     type="date"
                     name="periodEndDate"
                     value={formData.periodEndDate}
                     onChange={handleInputChange}
                     className="form-input"
                     required
                   />
                 </div>
               </div>
             </div>

             {/* Tarih Aralıkları */}
             <div className="form-section">
               <h3>Tarih Aralıkları</h3>
               <div className="date-range-grid">
                 <div className="date-range-section">
                   <h4>Hedef Giriş Dönemi</h4>
                   <div className="form-grid">
                     <div className="form-group">
                       <label className="form-label required">Başlangıç</label>
                       <input
                         type="date"
                         name="targetEntryStartDate"
                         value={formData.targetEntryStartDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label required">Bitiş</label>
                       <input
                         type="date"
                         name="targetEntryEndDate"
                         value={formData.targetEntryEndDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 <div className="date-range-section">
                   <h4>Hedef Revize Dönemi</h4>
                   <div className="form-grid">
                     <div className="form-group">
                       <label className="form-label required">Başlangıç</label>
                       <input
                         type="date"
                         name="targetReviseStartDate"
                         value={formData.targetReviseStartDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label required">Bitiş</label>
                       <input
                         type="date"
                         name="targetReviseEndDate"
                         value={formData.targetReviseEndDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 <div className="date-range-section">
                   <h4>Sonuç Giriş Dönemi</h4>
                   <div className="form-grid">
                     <div className="form-group">
                       <label className="form-label required">Başlangıç</label>
                       <input
                         type="date"
                         name="resultEntryStartDate"
                         value={formData.resultEntryStartDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                     <div className="form-group">
                       <label className="form-label required">Bitiş</label>
                       <input
                         type="date"
                         name="resultEntryEndDate"
                         value={formData.resultEntryEndDate}
                         onChange={handleInputChange}
                         className="form-input"
                         required
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

            {/* Bildirim Ayarları */}
            <div className="form-section">
              <h3>Bildirim Ayarları</h3>
              <div className="form-grid">
                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="sendNotification"
                        checked={formData.sendNotification}
                        onChange={handleInputChange}
                      />
                      Bildirim Gönder
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="sendEmail"
                        checked={formData.sendEmail}
                        onChange={handleInputChange}
                      />
                      E-posta Gönder
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Puanlama Sistemi */}
            <div className="form-section">
              <h3>Puanlama Sistemi</h3>
              <div className="scoring-info">
                <p>
                  <strong>Puanlama Sistemi Açıklaması:</strong>
                </p>
                <ul>
                  <li><strong>Pozitif Hedefler:</strong> Gerçekleşme oranı = (Gerçekleşen / Hedef) × 100</li>
                  <li><strong>Negatif Hedefler:</strong> Gerçekleşme oranı = ((Hedef - Gerçekleşen) / Hedef) × 100</li>
                  <li>Örnek: Hedef 100'den 20'ye düşürmek = %80 başarı</li>
                </ul>
              </div>
              <div className="scoring-section">
                {formData.scorings.map((scoring, index) => (
                  <div key={index} className="scoring-item">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Minimum Değer</label>
                        <input
                          type="number"
                          value={scoring.minValue}
                          onChange={(e) => updateScoring(index, 'minValue', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Maksimum Değer</label>
                        <input
                          type="number"
                          value={scoring.maxValue || ''}
                          onChange={(e) => updateScoring(index, 'maxValue', e.target.value ? parseFloat(e.target.value) : null)}
                          className="form-input"
                          step="0.01"
                          placeholder="Boş bırakılabilir"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Puan</label>
                        <input
                          type="number"
                          value={scoring.score}
                          onChange={(e) => updateScoring(index, 'score', parseFloat(e.target.value) || 0)}
                          className="form-input"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Harf Notu</label>
                        <input
                          type="text"
                          value={scoring.letterGrade}
                          onChange={(e) => updateScoring(index, 'letterGrade', e.target.value)}
                          className="form-input"
                          placeholder="Örn: A, B, C"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Negatif Hedef İçin</label>
                        <div className="checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={scoring.isForNegativeTarget}
                              onChange={(e) => updateScoring(index, 'isForNegativeTarget', e.target.checked)}
                            />
                            Negatif hedef için kullan
                            </label>
                        </div>
                      </div>

                      <div className="form-group">
                        <button
                          type="button"
                          onClick={() => removeScoring(index)}
                          className="btn btn-danger btn-sm"
                        >
                          <X size={16} />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addScoring}
                  className="btn btn-secondary"
                >
                  <Settings size={16} />
                  Puanlama Ekle
                </button>
              </div>
            </div>

            {/* Atamalar */}
            <div className="form-section">
              <h3>Atamalar</h3>
              
              {/* Departman Atamaları */}
              <div className="assignment-type-section">
                <div className="section-header">
                  <h4>Departman Atamaları</h4>
                  <div className="bulk-actions">
                    <button
                      type="button"
                      onClick={() => handleSelectAllDepartments(true)}
                      className="btn btn-secondary btn-sm"
                    >
                      Tümünü Seç
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAllDepartments(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Tümünü Kaldır
                    </button>
                  </div>
                </div>
                
                {/* Departman Arama */}
                <div className="search-section">
                  <div className="form-group">
                    <label className="form-label">Departman Ara</label>
                    <input
                      type="text"
                      value={departmentSearchTerm}
                      onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                      className="form-input"
                      placeholder="Departman adı ile arayın..."
                    />
                  </div>
                </div>
                
                <div className="department-assignments">
                  {filteredDepartments.map(dept => {
                    const isAssigned = formData.assignments.some(a => a.assignmentType === 1 && a.departmentId === dept.departmentId);
                    return (
                      <div key={dept.departmentId} className="assignment-card">
                        <div className="assignment-header">
                          <label className="assignment-checkbox">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={(e) => handleDepartmentAssignment(dept.departmentId, e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            {dept.departmentName}
                          </label>
                        </div>
                        
                        {isAssigned && (
                          <div className="assignment-details">
                            <div className="form-group">
                              <label className="form-label">Hedef Girişi Yapacak Rol</label>
                              <select
                                value={getAssignmentTargetEntryRole(dept.departmentId)}
                                onChange={(e) => updateDepartmentTargetEntryRole(dept.departmentId, e.target.value)}
                                className="form-input"
                              >
                                <option value="All">Tüm Roller</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Yönetici (Manager)</option>
                                <option value="User">Kullanıcı (User)</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Sonuç Girişi Yapacak Rol</label>
                              <select
                                value={getAssignmentResultEntryRole(dept.departmentId)}
                                onChange={(e) => updateDepartmentResultEntryRole(dept.departmentId, e.target.value)}
                                className="form-input"
                              >
                                <option value="All">Tüm Roller</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Yönetici (Manager)</option>
                                <option value="User">Kullanıcı (User)</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kullanıcı Atamaları */}
              <div className="assignment-type-section">
                <div className="section-header">
                  <h4>Kullanıcı Atamaları</h4>
                  <div className="bulk-actions">
                    <button
                      type="button"
                      onClick={() => handleSelectAllUsers(true)}
                      className="btn btn-secondary btn-sm"
                    >
                      Tümünü Seç
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAllUsers(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Tümünü Kaldır
                    </button>
                  </div>
                </div>
                
                {/* Kullanıcı Arama */}
                <div className="search-section">
                  <div className="form-group">
                    <label className="form-label">Kullanıcı Ara</label>
                    <input
                      type="text"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="form-input"
                      placeholder="Kullanıcı adı ile arayın..."
                    />
                  </div>
                </div>
                
                <div className="user-assignments">
                  {filteredUsers.map(user => {
                    const isAssigned = formData.assignments.some(a => a.assignmentType === 2 && a.userId === user.id);
                    return (
                      <div key={user.id} className="assignment-card">
                        <div className="assignment-header">
                          <label className="assignment-checkbox">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={(e) => handleUserAssignment(user.id, e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            {user.firstName} {user.lastName}
                          </label>
                        </div>
                        
                        {isAssigned && (
                          <div className="assignment-details">
                            <div className="assignment-info">
                              <p className="info-text">
                                <strong>Hedef Girişi ve Sonuç Girişi Yapacak Kişi:</strong> {user.firstName} {user.lastName} (Kendisi)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isEdit ? 'Güncelle' : 'Oluştur'}
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

export default PerformancePeriodModal;