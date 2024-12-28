import React from 'react';
import styled from '@emotion/styled';
import { CatBreed } from '../types';

const SelectContainer = styled.div`
    margin-bottom: 20px;
`;

const Select = styled.select`
    width: 200px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
`;

interface BreedSelectorProps {
    breeds: CatBreed[];
    selectedBreed: string;
    onBreedSelect: (breedId: string) => void;
}

export const BreedSelector: React.FC<BreedSelectorProps> = ({
    breeds,
    selectedBreed,
    onBreedSelect
}) => {
    return (
        <SelectContainer>
            <Select
                value={selectedBreed}
                onChange={(e) => onBreedSelect(e.target.value)}
            >
                <option value="">All Breeds</option>
                {breeds.map((breed) => (
                    <option key={breed.id} value={breed.id}>
                        {breed.name}
                    </option>
                ))}
            </Select>
        </SelectContainer>
    );
}; 