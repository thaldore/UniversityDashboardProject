import React, { useState, useEffect, useCallback } from 'react';
import chartService from '../../services/api/chartService';
import { CloseIcon, PlusIcon, TrashIcon, EditIcon } from '../common/Icons';

const ChartSectionManager = ({ isOpen, onClose, onSuccess, onDelete, editingSection }) => {
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
    const [expandedSections, setExpandedSections] = useState(new Set());
    const [loadingSections, setLoadingSections] = useState(new Set());
    const [loadedSections, setLoadedSections] = useState(new Set());

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
            // Load sections data same way as ChartsPage to know which sections have children
            const loadInitialData = async () => {
                try {
                    const sectionsResponse = await chartService.getChartSections();
                    const sectionsData = sectionsResponse.data || [];
                    
                    // Map only root sections, but include info about whether they have children
                    const rootSections = sectionsData.map(section => ({
                        id: section.sectionId,
                        title: section.sectionName || section.description || 'İsimsiz Başlık',
                        description: section.description,
                        parentSectionId: null,
                        orderIndex: section.displayOrder || 0,
                        hasSubSections: section.children && section.children.length > 0,
                        children: [] // Will be loaded when expanded
                    }))
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
                    
                    setSectionsTree(rootSections);
                } catch (err) {
                    console.error('Error loading sections:', err);
                    // If API fails, just set empty array
                    setSectionsTree([]);
                }
            };
            
            loadInitialData();
            
            // Reset expansion state
            setExpandedSections(new Set());
            setLoadedSections(new Set());
            
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
    }, [isOpen, editingSection, resetForm]);

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
            
            // Use onDelete if provided, otherwise fallback to onSuccess
            if (onDelete) {
                onDelete();
            } else {
                onSuccess();
            }
            
            // Reset any editing state
            resetForm();
            
        } catch (err) {
            console.error('Error deleting section:', err);
            setError('Başlık silinirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSectionExpansion = async (sectionId) => {
        const isCurrentlyExpanded = expandedSections.has(sectionId);
        
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyExpanded) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
        
        // If expanding and haven't loaded subsections yet, load them
        if (!isCurrentlyExpanded && !loadedSections.has(sectionId)) {
            await loadSectionData(sectionId);
        }
    };

    const loadSectionData = async (sectionId) => {
        try {
            setLoadingSections(prev => new Set([...prev, sectionId]));
            
            // Load full hierarchy from API (same as main ChartsPage)
            const response = await chartService.getChartSections();
            const allSections = response.data || [];
            
            // Find the section we're expanding and get its children
            const findSectionWithChildren = (sections, targetId) => {
                for (const section of sections) {
                    if (section.sectionId === targetId) {
                        return section;
                    }
                    if (section.children) {
                        const found = findSectionWithChildren(section.children, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            const sectionData = findSectionWithChildren(allSections, sectionId);
            
            if (sectionData && sectionData.children) {
                // Update the tree with the loaded subsections
                setSectionsTree(prevTree => {
                    const updateSectionChildren = (sections) => {
                        return sections.map(section => {
                            if (section.id === sectionId) {
                                return {
                                    ...section,
                                    children: sectionData.children.map(child => ({
                                        id: child.sectionId,
                                        title: child.sectionName || child.description || 'İsimsiz Başlık',
                                        description: child.description,
                                        parentSectionId: sectionId,
                                        orderIndex: child.displayOrder || 0,
                                        hasSubSections: child.children && child.children.length > 0,
                                        children: [] // Will be loaded when expanded
                                    }))
                                };
                            } else if (section.children) {
                                return {
                                    ...section,
                                    children: updateSectionChildren(section.children)
                                };
                            }
                            return section;
                        });
                    };
                    
                    return updateSectionChildren(prevTree);
                });
                
                setLoadedSections(prev => new Set([...prev, sectionId]));
            }
        } catch (err) {
            console.error('Error loading section data:', err);
            setError('Alt başlıklar yüklenirken hata oluştu.');
        } finally {
            setLoadingSections(prev => {
                const newSet = new Set(prev);
                newSet.delete(sectionId);
                return newSet;
            });
        }
    };

    const renderSectionItem = (section, level = 0) => {
        const hasChildren = section.children && section.children.length > 0;
        const isExpanded = expandedSections.has(section.id);
        const isLoading = loadingSections.has(section.id);
        const hasBeenLoaded = loadedSections.has(section.id);
        
        // Show expand button if section has loaded children OR if it has subsections that haven't been loaded yet
        const showExpandButton = hasChildren || (section.hasSubSections && !hasBeenLoaded);
        
        return (
            <div key={section.id} className={`hierarchy-item level-${level}`}>
                <div className="hierarchy-content">
                    <div className="hierarchy-title">
                        <span className="hierarchy-indent" style={{ paddingLeft: `${level * 1.5}rem` }}>
                            {level > 0 && <span className="hierarchy-connector">└ </span>}
                            {showExpandButton && (
                                <button 
                                    className="expand-toggle"
                                    onClick={() => toggleSectionExpansion(section.id)}
                                    type="button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? '⟳' : (isExpanded ? '▼' : '▶')}
                                </button>
                            )}
                            <span 
                                className={`section-name ${showExpandButton ? 'expandable' : ''}`}
                                onClick={() => showExpandButton && toggleSectionExpansion(section.id)}
                            >
                                {section.title}
                            </span>
                        </span>
                    </div>
                    <div className="hierarchy-actions">
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
                {/* Show children when expanded */}
                {hasChildren && isExpanded && (
                    <div className="hierarchy-children">
                        {section.children.map(child => 
                            renderSectionItem(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

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
            <div className="modal-container extra-large">
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
                                                    {'──'.repeat(section.level)}{section.level > 0 ? '└ ' : ''}{section.title}
                                                </option>
                                            ))}
                                    </select>
                                    <small className="form-help">
                                        Herhangi bir başlığın altına yeni başlık ekleyebilirsiniz. Derin hiyerarşi desteklenir.
                                    </small>
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
                                        onClick={() => {
                                            resetForm();
                                            onClose();
                                        }}
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
                            <h3>Başlık Hiyerarşisi</h3>
                            <div className="sections-tree">
                                {sectionsTree.length === 0 ? (
                                    <p className="empty-message">Henüz başlık oluşturulmamış.</p>
                                ) : (
                                    <div className="hierarchical-list">
                                        {sectionsTree.map(section => renderSectionItem(section))}
                                    </div>
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
