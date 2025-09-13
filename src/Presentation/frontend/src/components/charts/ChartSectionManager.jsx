import React, { useState, useEffect, useCallback } from 'react';
import chartService from '../../services/api/chartService';
import { CloseIcon, PlusIcon, TrashIcon, EditIcon } from '../common/Icons';

const ChartSectionManager = ({ isOpen, onClose, onSuccess, sections, editingSection }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        parentSectionId: null,
        orderIndex: 0
    });
    const [sectionsTree, setSectionsTree] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState(null);

    const buildTree = useCallback((items, parentId = null) => {
        return items
            .filter(item => item.parentSectionId === parentId)
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            title: '',
            description: '',
            parentSectionId: null,
            orderIndex: 0
        });
        setEditMode(false);
        setEditingSectionId(null);
        setError('');
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Map backend sections to frontend format
            const mappedSections = (sections || []).map(section => ({
                id: section.id || section.sectionId,
                title: section.title || section.sectionName || section.description || 'İsimsiz Başlık',
                description: section.description,
                parentSectionId: section.parentSectionId,
                orderIndex: section.orderIndex || section.displayOrder || 0,
                children: section.subSections?.map(child => ({
                    id: child.id || child.sectionId,
                    title: child.title || child.sectionName || child.description || 'İsimsiz Başlık',
                    description: child.description,
                    parentSectionId: child.parentSectionId || section.id || section.sectionId,
                    orderIndex: child.orderIndex || child.displayOrder || 0,
                    children: []
                })) || []
            }));
            
            const tree = buildTree(mappedSections);
            setSectionsTree(tree);
            if (editingSection) {
                setEditMode(true);
                setEditingSectionId(editingSection.id);
                setFormData({
                    title: editingSection.title || '',
                    description: editingSection.description || '',
                    parentSectionId: editingSection.parentSectionId || null,
                    orderIndex: editingSection.orderIndex || 0
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingSection, sections, buildTree, resetForm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'parentSectionId' || name === 'orderIndex' 
                ? (value === '' ? null : parseInt(value))
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            setError('Başlık gereklidir.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            if (editMode && editingSectionId) {
                await chartService.updateChartSection(editingSectionId, {
                    sectionName: formData.title,
                    description: formData.description,
                    displayOrder: formData.orderIndex,
                    isActive: true
                });
            } else {
                await chartService.createChartSection({
                    sectionName: formData.title,
                    description: formData.description,
                    parentId: formData.parentSectionId,
                    displayOrder: formData.orderIndex
                });
            }

            onSuccess();
            resetForm();
        } catch (err) {
            console.error('Error saving section:', err);
            setError(editMode ? 'Başlık güncellenirken bir hata oluştu.' : 'Başlık oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (section) => {
        setEditMode(true);
        setEditingSectionId(section.id);
        setFormData({
            title: section.title || '',
            description: section.description || '',
            parentSectionId: section.parentSectionId || null,
            orderIndex: section.orderIndex || 0
        });
    };

    const handleDelete = async (sectionId) => {
        if (!window.confirm('Bu başlığı silmek istediğinizden emin misiniz? Alt başlıklar ve grafikler de silinecektir.')) {
            return;
        }

        try {
            setLoading(true);
            await chartService.deleteChartSection(sectionId);
            onSuccess();
        } catch (err) {
            console.error('Error deleting section:', err);
            setError('Başlık silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const renderSectionItem = (section, level = 0) => (
        <div key={section.id} className={`section-item level-${level}`}>
            <div className="section-info">
                <div className="section-title-line">
                    <span className="section-title">{section.title}</span>
                    <div className="section-actions">
                        <button
                            type="button"
                            className="btn btn-xs btn-outline"
                            onClick={() => handleEdit(section)}
                            title="Düzenle"
                        >
                            <EditIcon className="w-3 h-3" />
                        </button>
                        <button
                            type="button"
                            className="btn btn-xs btn-danger"
                            onClick={() => handleDelete(section.id)}
                            title="Sil"
                        >
                            <TrashIcon className="w-3 h-3" />
                        </button>
                    </div>
                </div>
                {section.description && (
                    <p className="section-desc">{section.description}</p>
                )}
            </div>
            {section.children && section.children.length > 0 && (
                <div className="sub-sections">
                    {section.children.map(child => renderSectionItem(child, level + 1))}
                </div>
            )}
        </div>
    );

    const getFlatSections = (sections, level = 0) => {
        let result = [];
        sections.forEach(section => {
            result.push({ ...section, level });
            if (section.children) {
                result = result.concat(getFlatSections(section.children, level + 1));
            }
        });
        return result;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container large">
                <div className="modal-header">
                    <h2>{editMode ? 'Başlık Düzenle' : 'Başlık Yönetimi'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="section-manager-layout">
                        {/* Form Section */}
                        <div className="form-section">
                            <h3>{editMode ? 'Başlık Düzenle' : 'Yeni Başlık Ekle'}</h3>
                            
                            {error && (
                                <div className="error-message mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="section-form">
                                <div className="form-group">
                                    <label className="form-label required">Başlık</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Başlık girin..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-textarea"
                                        placeholder="Açıklama girin..."
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Üst Başlık</label>
                                    <select
                                        name="parentSectionId"
                                        value={formData.parentSectionId || ''}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Ana Başlık Olarak Ekle</option>
                                        {getFlatSections(sectionsTree)
                                            .filter(s => s.id !== editingSectionId)
                                            .map(section => (
                                                <option key={section.id} value={section.id}>
                                                    {'  '.repeat(section.level)}└ {section.title}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Sıra</label>
                                    <input
                                        type="number"
                                        name="orderIndex"
                                        value={formData.orderIndex}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="0"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Kaydediliyor...' : (editMode ? 'Güncelle' : 'Ekle')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Sections Tree */}
                        <div className="tree-section">
                            <h3>Mevcut Başlıklar</h3>
                            <div className="sections-tree">
                                {sectionsTree.length === 0 ? (
                                    <p className="empty-message">Henüz başlık oluşturulmamış.</p>
                                ) : (
                                    sectionsTree.map(section => renderSectionItem(section))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartSectionManager;
