package com.omega.warehousebackend.dto;

public class AdjustInventoryRequest {
    private int delta;
    private String reason;


    public AdjustInventoryRequest() {}

    public int getDelta() {
        return delta;
    }
    public String getReason() {return reason;}

    public void setDelta(int delta) {
        this.delta = delta;
    }
    public void setReason(String reason) {
        this.reason =reason;
    }
}
