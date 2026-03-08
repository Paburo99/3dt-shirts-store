<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SkusRelationManager extends RelationManager
{
    protected static string $relationship = 'skus';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required()
                    ->maxLength(255),
                ColorPicker::make('color')
                    ->required(),
                TextInput::make('size')
                    ->required()
                    ->maxLength(10),
                TextInput::make('stock')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->minValue(0),
                TextInput::make('price_override')
                    ->numeric()
                    ->prefix('COP')
                    ->helperText('Leave empty to use product base price'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('code')
            ->columns([
                TextColumn::make('code')
                    ->searchable(),
                ColorColumn::make('color'),
                TextColumn::make('size')
                    ->badge(),
                TextColumn::make('stock')
                    ->sortable()
                    ->color(fn (int $state): string => $state <= 2 ? 'danger' : ($state <= 5 ? 'warning' : 'success')),
                TextColumn::make('price_override')
                    ->money('COP', 0)
                    ->placeholder('Base price'),
            ])
            ->filters([])
            ->headerActions([
                CreateAction::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
