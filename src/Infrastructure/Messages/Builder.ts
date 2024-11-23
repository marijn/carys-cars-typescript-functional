class Builder<
    Kind extends { _named: Discriminator },
    Discriminator extends string
> {
    constructor(
        private fields: Kind
    ) {
        // intentionally empty
    }

    protected _andWith<Field extends keyof Omit<Kind, '_named'>>(field: Field, value: Kind[Field]): AndWithBuilder<Kind, Discriminator> {
        const newFields: Kind = {
            ...this.fields,
            ...{
                [field]: value,
            }
        };

        return new AndWithBuilder<Kind, Discriminator>(newFields);
    }

    toObject(): Kind {
        return {
            ...this.fields
        };
    }
}

class WithBuilder<
    Kind extends { _named: Discriminator },
    Discriminator extends string
> extends Builder<Kind, Discriminator> {
    with<Field extends keyof Omit<Kind, '_named'>>(field: Field, value: Kind[Field]): AndWithBuilder<Kind, Discriminator> {
        return this._andWith(field, value);
    }
}

class AndWithBuilder<
    Kind extends { _named: Discriminator },
    Discriminator extends string
> extends Builder<Kind, Discriminator> {
    andWith<Field extends keyof Omit<Kind, '_named'>>(field: Field, value: Kind[Field]): AndWithBuilder<Kind, Discriminator> {
        return this._andWith(field, value);
    }
}

export const builderFor = <
    Kind extends { _named: Discriminator },
    Discriminator extends string
>(example: Kind): () => WithBuilder<Kind, Discriminator> => {
    return () => new WithBuilder<Kind, Discriminator>(example);
};
